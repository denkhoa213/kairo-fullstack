import { BarChart2, Clock, Sparkles, Shield, Trophy } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeckCard from "../../components/ui/DeckCard";
import { MOCK_DASHBOARD_STATS, MOCK_SETS } from "../../data/mockData";
import { formatDuration, formatNumber } from "../../lib/utils";

export default function StatsPage() {
  const stats = MOCK_DASHBOARD_STATS;
  const progress = Math.round(
    (stats.cardsDueToday / Math.max(...stats.weeklyProgress, 1)) * 100,
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-[0.24em] mb-2">
              Thống kê
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Tổng quan học tập
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              Xem chi tiết tiến độ, trạng thái ôn tập và lịch học được cá nhân
              hóa.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-primary mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">Hiệu suất</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatNumber(stats.totalCardsLearned)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Thẻ đã học</p>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-primary mb-4">
              <BarChart2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Tiến độ tuần</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatNumber(
                stats.weeklyProgress.reduce((sum, v) => sum + v, 0),
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Thẻ đã học trong tuần
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-secondary mb-4">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-semibold">Ôn tập trong ngày</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {stats.cardsDueToday}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Thẻ cần ôn</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-info mb-4">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-semibold">Thời gian</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatDuration(stats.totalStudyTime * 60)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Thời gian học tổng cộng
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-warning mb-4">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-semibold">XP hiện tại</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatNumber(stats.xp)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Level {stats.level}
            </p>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Lịch ôn tập
              </h2>
              <p className="text-sm text-muted-foreground">
                Theo dõi số thẻ cần ôn vào mỗi ngày trong tuần.
              </p>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              Tiến độ khoảng {progress}%
            </div>
          </div>
          <div className="grid grid-cols-7 gap-3">
            {stats.weeklyProgress.map((value, index) => (
              <div key={index} className="space-y-2">
                <div className="h-40 rounded-3xl bg-muted overflow-hidden relative">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-primary transition-all"
                    style={{
                      height: `${Math.min(100, Math.max(12, (value / Math.max(...stats.weeklyProgress)) * 100))}%`,
                    }}
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  T{index + 2}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Bộ thẻ gần đây
              </h2>
              <p className="text-sm text-muted-foreground">
                Một vài bộ thẻ bạn đã xem hoặc ôn gần đây.
              </p>
            </div>
            <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Xem tất cả
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {MOCK_SETS.slice(0, 3).map((set) => (
              <DeckCard key={set._id} set={set} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
