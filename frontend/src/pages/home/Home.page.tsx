import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Zap,
  Star,
  Play,
  CheckCircle,
  Brain,
  Trophy,
  Flame,
  ChevronRight,
  Search,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import DeckCard, { DeckCardSkeleton } from "../../components/ui/DeckCard";
import { fetchFlashcardSets } from "../../lib/flashcards";
import { cn, formatNumber } from "../../lib/utils";
import type { Category, FlashcardSet } from "../../types";

// ── Animated counter hook ──────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Intersection observer hook ─────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Stat item ─────────────────────────────────────────────────────
function StatItem({
  icon,
  value,
  label,
  color,
  start,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  start: boolean;
}) {
  const count = useCountUp(value, 2000, start);
  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center",
          color,
        )}
      >
        {icon}
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-foreground">
          {formatNumber(count)}+
        </p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

// ── How it works step ─────────────────────────────────────────────
function StepCard({
  step,
  icon,
  title,
  desc,
  delay,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay: string;
}) {
  return (
    <div
      className="relative flex flex-col items-center text-center p-8 rounded-3xl bg-card border border-border shadow-xs hover:shadow-card transition-all duration-300 group animate-slide-in-up opacity-0"
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
    >
      {/* Step number */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-primary text-white text-sm font-bold flex items-center justify-center shadow-primary">
        {step}
      </div>
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

// ── Category card ─────────────────────────────────────────────────
const CATEGORY_COLORS = [
  {
    bg: "from-blue-500/20 to-cyan-500/20",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    bg: "from-red-500/20 to-pink-500/20",
    icon: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  {
    bg: "from-violet-500/20 to-purple-500/20",
    icon: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200 dark:border-violet-800",
  },
  {
    bg: "from-orange-500/20 to-amber-500/20",
    icon: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
  },
  {
    bg: "from-green-500/20 to-emerald-500/20",
    icon: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  {
    bg: "from-yellow-500/20 to-orange-500/20",
    icon: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  {
    bg: "from-teal-500/20 to-cyan-500/20",
    icon: "text-teal-600 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800",
  },
  {
    bg: "from-indigo-500/20 to-blue-500/20",
    icon: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
  },
];

// ── Main Home Page ─────────────────────────────────────────────────
export default function HomePage() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { ref: statsRef, inView: statsInView } = useInView();

  useEffect(() => {
    const loadSets = async () => {
      setIsLoading(true);
      try {
        const items = await fetchFlashcardSets({ limit: 12 });
        setSets(items);
      } catch (error) {
        console.error("Failed to load sets", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSets();
  }, []);

  const categories = useMemo(
    () =>
      sets
        .map((set) => set.category)
        .filter((cat): cat is Category => Boolean(cat))
        .filter(
          (cat, index, all) =>
            all.findIndex((item) => item._id === cat._id) === index,
        ),
    [sets],
  );

  const featuredSets = useMemo(
    () =>
      [...sets].sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 3),
    [sets],
  );

  const recentSets = useMemo(
    () =>
      [...sets]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 3),
    [sets],
  );

  return (
    <Layout>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

        {/* Decorative blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="flex flex-col gap-6">
              {/* Badge */}
              <div
                className="animate-slide-in-up opacity-0 stagger-1"
                style={{ animationFillMode: "forwards" }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  AI-powered Learning Platform
                </span>
              </div>

              {/* Headline */}
              <div
                className="animate-slide-in-up opacity-0 stagger-2"
                style={{ animationFillMode: "forwards" }}
              >
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                  Học mọi thứ <span className="gradient-text">nhanh hơn</span>{" "}
                  với Flashcard thông minh
                </h1>
              </div>

              {/* Subtitle */}
              <div
                className="animate-slide-in-up opacity-0 stagger-3"
                style={{ animationFillMode: "forwards" }}
              >
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Kairo kết hợp Spaced Repetition, AI và gamification để giúp
                  bạn ghi nhớ từ vựng, kiến thức và thông tin hiệu quả nhất.
                </p>
              </div>

              {/* CTAs */}
              <div
                className="flex flex-wrap gap-3 animate-slide-in-up opacity-0 stagger-4"
                style={{ animationFillMode: "forwards" }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold text-base shadow-primary hover:opacity-90 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Zap className="w-5 h-5" />
                  Bắt đầu miễn phí
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
                <Link
                  to="/sets"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border border-border bg-card text-foreground font-semibold text-base hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5" />
                  Khám phá bộ thẻ
                </Link>
              </div>

              {/* Social proof */}
              <div
                className="flex items-center gap-4 animate-slide-in-up opacity-0 stagger-5"
                style={{ animationFillMode: "forwards" }}
              >
                <div className="flex -space-x-2">
                  {["🧑‍🎓", "👩‍💻", "🧑‍🏫", "👨‍🎓"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm font-medium text-foreground ml-1">
                      4.9
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Được tin dùng bởi 50.000+ học viên
                  </p>
                </div>
              </div>
            </div>

            {/* Right — floating flashcard illustration */}
            <div className="relative hidden lg:flex items-center justify-center h-[480px]">
              {/* Main card */}
              <div className="absolute w-72 h-48 bg-card rounded-3xl border border-border shadow-xl flex flex-col items-center justify-center gap-3 animate-float">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <p className="text-lg font-bold text-foreground">Ephemeral</p>
                <p className="text-sm text-muted-foreground px-6 text-center">
                  lasting for a very short time
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-success/10 text-success text-xs font-medium rounded-full">
                    ✓ Đã thuộc
                  </span>
                </div>
              </div>

              {/* Secondary card - top right */}
              <div
                className="absolute top-8 right-4 w-52 h-32 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-primary flex flex-col items-center justify-center gap-2 animate-float-delay-1"
                style={{ animationDelay: "0.5s" }}
              >
                <p className="text-white text-xs font-medium opacity-80">
                  Match Game
                </p>
                <div className="text-2xl font-bold text-white">⚡ 0:42</div>
                <p className="text-white/80 text-xs">8/10 đúng</p>
              </div>

              {/* Tertiary card - bottom left */}
              <div
                className="absolute bottom-12 left-4 w-56 bg-card rounded-2xl border border-border shadow-lg p-4 animate-float-delay-2"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-semibold text-foreground">
                    Streak 12 ngày 🔥
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: "68%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  68% hoàn thành hôm nay
                </p>
              </div>

              {/* Achievement badge */}
              <div
                className="absolute top-1/2 right-0 -translate-y-1/2 bg-card rounded-2xl border border-border shadow-lg p-3 flex items-center gap-2 animate-float-delay-1"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="text-2xl">🏆</div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Level Up!
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Đạt Level 8
                  </p>
                </div>
              </div>

              {/* XP pill */}
              <div
                className="absolute bottom-4 right-8 bg-gradient-primary text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-primary animate-float"
                style={{ animationDelay: "0.75s" }}
              >
                +25 XP ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── STATS ─────────────── */}
      <section
        ref={statsRef}
        className="py-16 border-y border-border bg-card/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            <StatItem
              icon={<BookOpen className="w-6 h-6 text-primary" />}
              value={50000}
              label="Bộ thẻ"
              color="bg-primary/10"
              start={statsInView}
            />
            <StatItem
              icon={<Users className="w-6 h-6 text-secondary" />}
              value={250000}
              label="Học viên"
              color="bg-secondary/10"
              start={statsInView}
            />
            <StatItem
              icon={<Zap className="w-6 h-6 text-warning" />}
              value={5000000}
              label="Lượt học"
              color="bg-warning/10"
              start={statsInView}
            />
            <StatItem
              icon={<Star className="w-6 h-6 text-yellow-500" />}
              value={98}
              label="% hài lòng"
              color="bg-yellow-500/10"
              start={statsInView}
            />
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURED SETS ─────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-sm font-medium text-primary">Nổi bật</span>
              <h2 className="text-3xl font-bold text-foreground mt-1">
                Bộ thẻ phổ biến
              </h2>
              <p className="text-muted-foreground mt-2">
                Được học viên đánh giá cao nhất
              </p>
            </div>
            <Link
              to="/sets"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200 group flex-shrink-0"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm bộ thẻ..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-sm"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => <DeckCardSkeleton key={i} />)
              : featuredSets.map((set, i) => (
                  <div
                    key={set._id}
                    className="animate-slide-in-up opacity-0"
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <DeckCard set={set} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ─────────────── CATEGORIES ─────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary">Danh mục</span>
            <h2 className="text-3xl font-bold text-foreground mt-1 mb-3">
              Học theo chủ đề
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Từ ngôn ngữ đến lập trình, toán học đến marketing — tìm ngay chủ
              đề bạn muốn học.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-shimmer rounded-3xl border border-border bg-card p-6 h-40"
                  />
                ))
            ) : categories.length > 0 ? (
              categories.map((cat, i) => {
                const colors = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                return (
                  <Link
                    key={cat._id}
                    to={`/sets?category=${cat.slug}`}
                    className={cn(
                      "group flex flex-col items-center gap-3 p-6 rounded-2xl border bg-gradient-to-br",
                      colors.bg,
                      colors.border,
                      "hover:-translate-y-1 hover:shadow-md transition-all duration-300",
                    )}
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {cat.icon ?? "📚"}
                    </span>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">
                        {cat.name}
                      </p>
                      <p className={cn("text-xs mt-0.5", colors.icon)}>
                        {formatNumber(cat.deckCount || 0)} bộ thẻ
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full rounded-3xl border border-border bg-card p-10 text-center">
                <p className="text-foreground font-semibold">
                  Chưa có danh mục để hiển thị.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS ─────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary">
              Cách hoạt động
            </span>
            <h2 className="text-3xl font-bold text-foreground mt-1 mb-3">
              Học hiệu quả chỉ với 3 bước
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Bắt đầu hành trình học tập ngay hôm nay — đơn giản, nhanh chóng,
              hiệu quả.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-1/3 left-1/3 right-1/3 h-0.5 bg-gradient-primary opacity-30" />
            <StepCard
              step={1}
              icon={<BookOpen className="w-8 h-8 text-primary" />}
              title="Tạo hoặc chọn bộ thẻ"
              desc="Tạo bộ flashcard của riêng bạn hoặc khám phá hàng ngàn bộ thẻ có sẵn từ cộng đồng."
              delay="0.1s"
            />
            <StepCard
              step={2}
              icon={<Play className="w-8 h-8 text-secondary" />}
              title="Học với nhiều chế độ"
              desc="Lật thẻ, kiểm tra, ghép cặp, hoặc để AI lên lịch ôn tập tối ưu cho bạn."
              delay="0.25s"
            />
            <StepCard
              step={3}
              icon={<Trophy className="w-8 h-8 text-warning" />}
              title="Theo dõi tiến độ"
              desc="Xem streak, XP, biểu đồ học tập và thành tích. Mỗi ngày học là một ngày tiến bộ."
              delay="0.4s"
            />
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURES ─────────────── */}
      <section className="py-20 bg-gradient-to-br from-primary/3 via-background to-secondary/3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-primary">Tính năng</span>
            <h2 className="text-3xl font-bold text-foreground mt-1 mb-3">
              Mọi công cụ bạn cần
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "🧠",
                title: "Spaced Repetition",
                desc: "Thuật toán SM-2 tự tính lịch ôn tập, giúp bạn nhớ lâu hơn với ít thời gian hơn.",
                color: "from-blue-500/10 to-indigo-500/10",
              },
              {
                icon: "⚡",
                title: "6 Chế độ học",
                desc: "Flashcard, Learn, Write, Test, Match Game, Speed Challenge — đa dạng để không bao giờ chán.",
                color: "from-violet-500/10 to-purple-500/10",
              },
              {
                icon: "🤖",
                title: "AI tạo thẻ",
                desc: "Tự động sinh Flashcard từ văn bản, PDF, URL, YouTube. Tiết kiệm hàng giờ soạn thảo.",
                color: "from-pink-500/10 to-rose-500/10",
              },
              {
                icon: "🏆",
                title: "Gamification",
                desc: "XP, level, streak, achievements và leaderboard — biến việc học thành trò chơi thú vị.",
                color: "from-yellow-500/10 to-orange-500/10",
              },
              {
                icon: "👥",
                title: "Cộng đồng",
                desc: "Chia sẻ, follow, bình luận và đánh giá bộ thẻ. Học cùng hàng ngàn người khác.",
                color: "from-green-500/10 to-emerald-500/10",
              },
              {
                icon: "📱",
                title: "Responsive",
                desc: "Học mọi lúc, mọi nơi. Giao diện tối ưu trên Desktop, Tablet và Mobile.",
                color: "from-teal-500/10 to-cyan-500/10",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={cn(
                  "p-6 rounded-2xl bg-gradient-to-br border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-card",
                  feature.color,
                )}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative bg-gradient-primary rounded-3xl p-12 overflow-hidden shadow-primary">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Bắt đầu học ngay hôm nay
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                Miễn phí, không cần thẻ tín dụng. Tham gia cùng 250.000+ học
                viên đang dùng Kairo.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-base hover:bg-white/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  Tạo tài khoản miễn phí
                </Link>
                <Link
                  to="/sets"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all duration-300"
                >
                  <BookOpen className="w-5 h-5" />
                  Khám phá trước
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-white/70 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Miễn phí mãi mãi
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Không quảng cáo
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Hàng ngàn bộ thẻ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
