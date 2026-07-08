import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Grid3X3, List, BookOpen } from "lucide-react";
import Layout from "../../components/layout/Layout";
import DeckCard, { DeckCardSkeleton } from "../../components/ui/DeckCard";
import { fetchFlashcardSets } from "../../lib/flashcards";
import { socket } from "../../lib/socket";
import { cn } from "../../lib/utils";
import type { Category, FlashcardSet } from "../../types";

type SortOption = "newest" | "popular" | "rating" | "name";
type ViewMode = "grid" | "list";

export default function SetListPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSets = async () => {
    setIsLoading(true);
    try {
      const items = await fetchFlashcardSets();
      setSets(items);
      const uniqueCategories = items
        .map((set: FlashcardSet) => set.category)
        .filter((cat: Category | undefined): cat is Category => Boolean(cat));
      setCategories(
        uniqueCategories.filter(
          (cat: Category, index: number, all: Category[]) =>
            all.findIndex((item: Category) => item._id === cat._id) === index,
        ),
      );
    } catch (error) {
      console.error("Failed to load flashcard sets", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSets();

    const handleSetsUpdated = () => {
      loadSets();
    };

    socket.on("setsUpdated", handleSetsUpdated);
    return () => {
      socket.off("setsUpdated", handleSetsUpdated);
    };
  }, []);

  const filtered = useMemo(() => {
    let result = [...sets];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q),
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category?.slug === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "popular") return b.favoriteCount - a.favoriteCount;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [search, selectedCategory, sortBy, sets]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Khám phá bộ thẻ
          </h1>
          <p className="text-muted-foreground">
            {sets.length.toLocaleString()} bộ thẻ từ cộng đồng học viên
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bộ thẻ..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-3 rounded-2xl border border-border bg-card text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="newest">Mới nhất</option>
            <option value="rating">Đánh giá cao</option>
            <option value="name">Tên A-Z</option>
          </select>

          {/* View toggle */}
          <div className="flex rounded-2xl border border-border bg-card p-1 gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                viewMode === "grid"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                viewMode === "list"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
              selectedCategory === "all"
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
            )}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-1.5",
                selectedCategory === cat.slug
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            kết quả
            {search && ` cho "${search}"`}
          </span>
        </div>

        {/* Grid / List */}
        {isLoading ? (
          <div
            className={cn(
              "grid gap-5",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <DeckCardSkeleton key={i} compact={viewMode === "list"} />
              ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Không tìm thấy bộ thẻ
            </h3>
            <p className="text-muted-foreground text-sm">
              Thử tìm kiếm với từ khóa khác hoặc{" "}
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="text-primary hover:underline"
              >
                xóa bộ lọc
              </button>
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-5",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            {filtered.map((set, i) => (
              <div
                key={set._id}
                className="animate-slide-in-up opacity-0"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animationFillMode: "forwards",
                }}
              >
                <DeckCard set={set} compact={viewMode === "list"} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
