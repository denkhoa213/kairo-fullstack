import { useEffect, useState, useCallback } from "react";
import { useFlashcardStore } from "@/stores/flashcardStore";

interface UseSetListOptions {
  initialSearch?: string;
  initialCategory?: string;
}

export function useSetList(options: UseSetListOptions = {}) {
  const { sets, totalSets, currentPage, isLoadingSets, fetchSets } = useFlashcardStore();

  const [search, setSearch] = useState(options.initialSearch ?? "");
  const [category, setCategory] = useState(options.initialCategory ?? "");
  const [sort, setSort] = useState<"newest" | "popular" | "rating">("newest");
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    fetchSets({
      search: search || undefined,
      category: category || undefined,
      sort,
      page,
    });
  }, [fetchSets, search, category, sort, page]);

  // Initial load + refetch on filter change
  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (value: "newest" | "popular" | "rating") => {
    setSort(value);
    setPage(1);
  };

  return {
    sets,
    totalSets,
    currentPage,
    isLoading: isLoadingSets,
    search,
    category,
    sort,
    page,
    setPage,
    handleSearch,
    handleCategoryChange,
    handleSortChange,
    refetch: load,
  };
}
