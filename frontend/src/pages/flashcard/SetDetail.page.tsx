import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  BookOpen,
  Heart,
  Bookmark,
  Share2,
  Eye,
  Star,
  Users,
  Globe,
  ChevronRight,
  Play,
  Brain,
  Edit3,
  FileText,
  Zap,
  Target,
  Clock,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import FlashCard from "../../components/ui/FlashCard";
import { fetchFlashcardSetDetail } from "../../lib/flashcards";
import { joinSetRoom, leaveSetRoom, socket } from "../../lib/socket";
import {
  cn,
  formatNumber,
  formatRelativeTime,
  getInitials,
} from "../../lib/utils";
import type { Flashcard, FlashcardSet } from "../../types";

type Tab = "cards" | "comments" | "related";

interface SetDetailData {
  set: FlashcardSet;
  flashcards: Flashcard[];
}

// ── Study Mode Card ──────────────────────────────────────────────────
function StudyModeCard({
  icon,
  label,
  desc,
  color,
  href,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  color: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-center",
        primary
          ? "bg-gradient-primary border-primary/30 shadow-primary text-white"
          : "bg-card border-border hover:border-primary/40 hover:bg-primary/3",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          primary ? "bg-white/20" : color,
        )}
      >
        {icon}
      </div>
      <div>
        <p
          className={cn(
            "text-sm font-semibold",
            primary ? "text-white" : "text-foreground",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-xs mt-0.5",
            primary ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {desc}
        </p>
      </div>
    </Link>
  );
}

export default function SetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("cards");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [detail, setDetail] = useState<SetDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const data = await fetchFlashcardSetDetail(id);
        setDetail(data);
        setPreviewIndex(0);
      } catch (error) {
        console.error("Failed to load set detail", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadDetail();
    joinSetRoom(id);

    const handleSetUpdated = async () => {
      if (!id) return;
      try {
        const data = await fetchFlashcardSetDetail(id);
        setDetail(data);
      } catch (error) {
        console.error("Failed to refresh set detail", error);
      }
    };

    socket.on("setUpdated", handleSetUpdated);

    return () => {
      leaveSetRoom(id);
      socket.off("setUpdated", handleSetUpdated);
    };
  }, [id]);

  const set = detail?.set ?? ({} as FlashcardSet);
  const cards = detail?.flashcards ?? [];
  const cardCount = cards.length;
  const hasCards = cardCount > 0;
  const previewCard: Flashcard = hasCards
    ? cards[previewIndex]
    : {
        _id: "",
        setId: id || "",
        front: "Chưa có thẻ nào",
        back: "Thêm thẻ vào bộ để xem thử",
        order: 0,
      };

  useEffect(() => {
    if (previewIndex >= cardCount) {
      setPreviewIndex(0);
    }
  }, [cardCount, previewIndex]);

  const stateColors = {
    new: "bg-muted text-muted-foreground",
    learning:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    review: "bg-warning/10 text-warning",
    mastered: "bg-success/10 text-success",
  };

  const stateLabels = {
    new: "Mới",
    learning: "Đang học",
    review: "Ôn tập",
    mastered: "Thuộc rồi",
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="animate-pulse rounded-2xl bg-card border border-border p-8">
              <div className="h-6 w-48 bg-muted rounded mb-4 mx-auto" />
              <div className="h-4 w-80 bg-muted rounded mb-2 mx-auto" />
              <div className="h-4 w-64 bg-muted rounded mx-auto" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (hasError || !detail) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Không thể tải bộ thẻ
            </h3>
            <p className="text-muted-foreground text-sm">
              Đã có lỗi xảy ra. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            to="/sets"
            className="hover:text-primary transition-colors duration-200"
          >
            Khám phá
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium truncate">
            {set.name}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: Details ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header card */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden">
              {/* Cover */}
              <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 relative flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary/30" />
                {set.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium">
                    {set.category.icon} {set.category.name}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {set.name}
                </h1>
                {set.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {set.description}
                  </p>
                )}

                {/* Tags */}
                {set.tags && set.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {set.tags.map((tag) => (
                      <span key={tag._id} className="badge-primary">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {set.author && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-[10px] font-bold">
                        {getInitials(set.author.name)}
                      </div>
                      <span>{set.author.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{set.totalCards} thẻ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(set.viewCount || 0)} lượt xem</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{set.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>Công khai</span>
                  </div>
                  <span className="text-xs">
                    {formatRelativeTime(set.updatedAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200",
                      isLiked
                        ? "border-destructive/30 bg-destructive/8 text-destructive"
                        : "border-border bg-card hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive",
                    )}
                  >
                    <Heart
                      className={cn("w-4 h-4", isLiked && "fill-current")}
                    />
                    {formatNumber(set.favoriteCount + (isLiked ? 1 : 0))}
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200",
                      isBookmarked
                        ? "border-primary/30 bg-primary/8 text-primary"
                        : "border-border bg-card hover:border-primary/30 hover:bg-primary/5 text-muted-foreground hover:text-primary",
                    )}
                  >
                    <Bookmark
                      className={cn("w-4 h-4", isBookmarked && "fill-current")}
                    />
                    Lưu
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </button>
                  <button className="ml-auto p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                    <MoreHorizontal className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview flashcard */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">
                  Xem trước thẻ
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPreviewIndex(Math.max(0, previewIndex - 1));
                      setIsFlipped(false);
                    }}
                    disabled={previewIndex === 0}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-accent transition-colors duration-200"
                  >
                    ←
                  </button>
                  <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
                    {previewIndex + 1} / {cards.length}
                  </span>
                  <button
                    onClick={() => {
                      setPreviewIndex(
                        Math.min(cards.length - 1, previewIndex + 1),
                      );
                      setIsFlipped(false);
                    }}
                    disabled={previewIndex === cards.length - 1}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-accent transition-colors duration-200"
                  >
                    →
                  </button>
                </div>
              </div>
              <FlashCard
                card={previewCard}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                size="sm"
              />
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-1 p-1 bg-muted/50 rounded-2xl mb-5">
                {(["cards", "comments", "related"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                      activeTab === tab
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab === "cards" && "Danh sách thẻ"}
                    {tab === "comments" && "Bình luận"}
                    {tab === "related" && "Liên quan"}
                  </button>
                ))}
              </div>

              {activeTab === "cards" && (
                <div className="flex flex-col gap-2">
                  {cards.map((card, i) => (
                    <div
                      key={card._id}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/2 transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        setPreviewIndex(i);
                        setIsFlipped(false);
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {card.front}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {card.back}
                        </p>
                        {card.example && (
                          <p className="text-xs text-primary/70 mt-1 italic">
                            Ví dụ: {card.example}
                          </p>
                        )}
                      </div>
                      {card.state && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0",
                            stateColors[card.state],
                          )}
                        >
                          {stateLabels[card.state]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Chưa có bình luận nào
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Đăng nhập để bình luận
                  </p>
                </div>
              )}

              {activeTab === "related" && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Sẽ hiển thị các bộ thẻ liên quan
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Study modes ── */}
          <div className="flex flex-col gap-5">
            <div className="bg-card border border-border rounded-3xl p-5 sticky top-20">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Bắt đầu học
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <StudyModeCard
                  href={`/study/${set._id}/flashcard`}
                  icon={<Play className="w-5 h-5 text-white" />}
                  label="Flashcard"
                  desc="Lật thẻ"
                  color=""
                  primary
                />
                <StudyModeCard
                  href={`/study/${set._id}/learn`}
                  icon={<Brain className="w-5 h-5 text-violet-600" />}
                  label="Learn"
                  desc="Trắc nghiệm"
                  color="bg-violet-100 dark:bg-violet-900/30"
                />
                <StudyModeCard
                  href={`/study/${set._id}/write`}
                  icon={<Edit3 className="w-5 h-5 text-pink-600" />}
                  label="Write"
                  desc="Điền từ"
                  color="bg-pink-100 dark:bg-pink-900/30"
                />
                <StudyModeCard
                  href={`/study/${set._id}/test`}
                  icon={<FileText className="w-5 h-5 text-orange-600" />}
                  label="Test"
                  desc="Kiểm tra"
                  color="bg-orange-100 dark:bg-orange-900/30"
                />
                <StudyModeCard
                  href={`/study/${set._id}/match`}
                  icon={<Target className="w-5 h-5 text-green-600" />}
                  label="Match"
                  desc="Ghép cặp"
                  color="bg-green-100 dark:bg-green-900/30"
                />
                <StudyModeCard
                  href={`/study/${set._id}/speed`}
                  icon={<Zap className="w-5 h-5 text-yellow-600" />}
                  label="Speed"
                  desc="60 giây"
                  color="bg-yellow-100 dark:bg-yellow-900/30"
                />
              </div>

              {/* Progress summary */}
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Tiến độ học
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Mới", count: 3, color: "bg-muted", pct: 50 },
                    {
                      label: "Đang học",
                      count: 1,
                      color: "bg-blue-500",
                      pct: 17,
                    },
                    { label: "Ôn tập", count: 1, color: "bg-warning", pct: 17 },
                    {
                      label: "Thuộc rồi",
                      count: 1,
                      color: "bg-success",
                      pct: 17,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div className={cn("w-2 h-2 rounded-full", item.color)} />
                      <span className="text-muted-foreground flex-1">
                        {item.label}
                      </span>
                      <span className="font-medium text-foreground">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex rounded-full overflow-hidden h-2">
                  <div className="bg-muted w-[50%]" />
                  <div className="bg-blue-500 w-[17%]" />
                  <div className="bg-warning w-[17%]" />
                  <div className="bg-success w-[17%]" />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>{formatNumber(set.viewCount || 0)} học</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{Math.ceil(set.totalCards * 0.5)} phút</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
