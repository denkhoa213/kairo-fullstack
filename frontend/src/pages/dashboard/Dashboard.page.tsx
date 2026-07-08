import { Link } from "react-router";
import { useEffect, useState } from "react";
import {
  Flame,
  BookOpen,
  Clock,
  Star,
  Zap,
  ArrowRight,
  Play,
  BarChart2,
  Trophy,
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeckCard from "../../components/ui/DeckCard";
import useAuthStore from "../../stores/authStore";
import { fetchDashboardStats } from "../../lib/flashcards";
import { cn, formatDuration, formatNumber } from "../../lib/utils";

// ── Stat Card ──────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  trend?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-card transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            color,
          )}
        >
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-success flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/70 mt-1">{sub}</p>}
    </div>
  );
}

// ── Mini progress bar ──────────────────────────────────────────────
function MiniBar({
  day,
  value,
  max,
}: {
  day: string;
  value: number;
  max: number;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-xs text-muted-foreground">{value}</span>
      <div
        className="w-6 bg-muted rounded-full overflow-hidden"
        style={{ height: "60px" }}
      >
        <div
          className="w-full rounded-full bg-gradient-primary transition-all duration-700"
          style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">{day}</span>
    </div>
  );
}

// ── Study Mode Button ──────────────────────────────────────────────
function StudyModeBtn({
  icon,
  label,
  desc,
  href,
  color,
}: {
  icon: string;
  label: string;
  desc: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "group flex items-center gap-3 p-4 rounded-2xl border border-border hover:border-primary/40 bg-card hover:bg-primary/3 transition-all duration-200",
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
          color,
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
          {label}
        </p>
        <p className="text-xs text-muted-foreground truncate">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
    </Link>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(() => ({
    streak: 0,
    totalCardsLearned: 0,
    cardsDueToday: 0,
    totalStudyTime: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    recentSets: [],
    xp: 0,
    level: 1,
    xpToNextLevel: 1000,
  }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const s = await fetchDashboardStats();
        if (mounted) setStats(s as any);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const firstName = user?.name?.split(" ").pop() || "bạn";
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const maxProgress = Math.max(...stats.weeklyProgress, 1);

  // XP progress to next level
  const xpPct = Math.round((stats.xp / stats.xpToNextLevel) * 100);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting()}, {firstName}! 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Hôm nay bạn có{" "}
              <span className="text-primary font-semibold">
                {stats.cardsDueToday} thẻ
              </span>{" "}
              cần ôn tập.
            </p>
          </div>
          <Link
            to="/sets"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-primary text-white font-semibold text-sm shadow-primary hover:opacity-90 transition-all duration-200 w-fit"
          >
            <Play className="w-4 h-4" />
            Ôn tập ngay
          </Link>
        </div>

        {/* ── Streak Banner ── */}
        {stats.streak > 0 && (
          <div className="relative mb-6 p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 dark:border-orange-800 overflow-hidden">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20 animate-flame">
              🔥
            </div>
            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500 animate-flame" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  🔥 {stats.streak} ngày streak!
                </p>
                <p className="text-sm text-muted-foreground">
                  Tiếp tục duy trì — học hôm nay để không mất streak!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-primary" />}
            label="Thẻ đã học"
            value={formatNumber(stats.totalCardsLearned)}
            color="bg-primary/10"
            trend="+12%"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5 text-warning" />}
            label="Cần ôn hôm nay"
            value={stats.cardsDueToday}
            sub="Spaced Repetition"
            color="bg-warning/10"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-info" />}
            label="Thời gian học"
            value={formatDuration(stats.totalStudyTime * 60)}
            sub="Tổng cộng"
            color="bg-info/10"
          />
          <StatCard
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            label="XP tích lũy"
            value={formatNumber(stats.xp)}
            sub={`Level ${stats.level}`}
            color="bg-yellow-500/10"
            trend="+25 hôm nay"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* ── Weekly Progress Chart ── */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Tiến độ tuần này
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Số thẻ học mỗi ngày
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-success font-medium">
                <BarChart2 className="w-4 h-4" />
                +18% so với tuần trước
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 px-2">
              {stats.weeklyProgress.map((val, i) => (
                <MiniBar
                  key={i}
                  day={weekDays[i]}
                  value={val}
                  max={maxProgress}
                />
              ))}
            </div>
          </div>

          {/* ── XP & Level ── */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Level {stats.level}
                </p>
                <p className="text-xs text-muted-foreground">
                  Học viên xuất sắc
                </p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>{formatNumber(stats.xp)} XP</span>
                <span>{formatNumber(stats.xpToNextLevel)} XP</span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 text-right">
                {stats.xpToNextLevel - stats.xp} XP đến Level {stats.level + 1}
              </p>
            </div>

            {/* Achievements */}
            <div className="space-y-2">
              {[
                { icon: "🔥", label: "Streak 7 ngày", done: true },
                { icon: "📚", label: "Học 1000 thẻ", done: true },
                { icon: "⚡", label: "Hoàn thành Test 100%", done: false },
                { icon: "🏆", label: "Top 10 Leaderboard", done: false },
              ].map((ach, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className={cn("text-base", !ach.done && "opacity-30")}>
                    {ach.icon}
                  </span>
                  <span
                    className={cn(
                      "text-xs flex-1",
                      ach.done
                        ? "text-foreground font-medium"
                        : "text-muted-foreground",
                    )}
                  >
                    {ach.label}
                  </span>
                  {ach.done ? (
                    <CheckCircle className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-muted" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Study Modes ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <h2 className="col-span-full text-base font-semibold text-foreground">
            Chế độ học
          </h2>
          <StudyModeBtn
            icon="🃏"
            label="Flashcard"
            desc="Lật thẻ, đánh giá bản thân"
            href="/study/set3/flashcard"
            color="bg-blue-500/10"
          />
          <StudyModeBtn
            icon="📖"
            label="Learn Mode"
            desc="Câu hỏi trắc nghiệm 4 đáp án"
            href="/study/set3/learn"
            color="bg-violet-500/10"
          />
          <StudyModeBtn
            icon="✍️"
            label="Write Mode"
            desc="Điền đáp án, kiểm tra chính tả"
            href="/study/set3/write"
            color="bg-pink-500/10"
          />
          <StudyModeBtn
            icon="📝"
            label="Test Mode"
            desc="Đề kiểm tra tổng hợp"
            href="/study/set3/test"
            color="bg-orange-500/10"
          />
          <StudyModeBtn
            icon="🎯"
            label="Match Game"
            desc="Ghép thuật ngữ với nghĩa"
            href="/study/set3/match"
            color="bg-green-500/10"
          />
          <StudyModeBtn
            icon="⚡"
            label="Speed Challenge"
            desc="Trả lời nhiều nhất trong 60 giây"
            href="/study/set3/speed"
            color="bg-yellow-500/10"
          />
        </div>

        {/* ── AI Section ── */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  AI tạo Flashcard
                </p>
                <p className="text-xs text-muted-foreground">
                  Dán văn bản, URL, PDF để tự động tạo bộ thẻ
                </p>
              </div>
            </div>
            <Link
              to="/create?ai=true"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors duration-200 flex-shrink-0"
            >
              <Zap className="w-4 h-4" />
              Thử ngay
            </Link>
          </div>
        </div>

        {/* ── Recent Sets ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Bộ thẻ gần đây
            </h2>
            <Link
              to="/sets"
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="animate-shimmer rounded-2xl border border-border bg-card p-4 h-28"
                    />
                  ))
              : stats.recentSets.map((set: any) => (
                  <DeckCard key={set._id} set={set} compact />
                ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
