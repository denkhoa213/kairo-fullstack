import { Trophy, Users, Sparkles, ArrowRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { formatNumber } from "../../lib/utils";

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Hà Minh", xp: 14920, streak: 36 },
  { rank: 2, name: "Khánh An", xp: 13850, streak: 29 },
  { rank: 3, name: "Trang Linh", xp: 13120, streak: 24 },
  { rank: 4, name: "Minh Quân", xp: 12400, streak: 18 },
  { rank: 5, name: "An Ngọc", xp: 11850, streak: 15 },
];

export default function LeaderboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm text-primary font-semibold uppercase tracking-[0.24em] mb-2">
              Xếp hạng
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Những người học hàng đầu
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              Xem ai đang dẫn đầu về XP, streak và thói quen học tập. Thử thách
              bản thân bằng cách leo lên bảng xếp hạng.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-primary mb-3">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-semibold">Bảng xếp hạng tuần</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-primary/5 p-4">
                <p className="text-xs text-muted-foreground">Top XP</p>
                <p className="text-xl font-bold">{formatNumber(14920)}</p>
              </div>
              <div className="rounded-2xl bg-accent/5 p-4">
                <p className="text-xs text-muted-foreground">Streak dài nhất</p>
                <p className="text-xl font-bold">36 ngày</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-primary mb-4">
              <Users className="w-5 h-5" />
              <span className="text-sm font-semibold">Người chơi</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatNumber(12458)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Người dùng hoạt động tuần này
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-secondary mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">Thành tích</span>
            </div>
            <p className="text-3xl font-bold text-foreground">+18%</p>
            <p className="text-sm text-muted-foreground mt-2">
              Tăng trưởng XP so với tuần trước
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-warning mb-4">
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-semibold">Nhiệm vụ</span>
            </div>
            <p className="text-3xl font-bold text-foreground">5</p>
            <p className="text-sm text-muted-foreground mt-2">
              Thử thách đang mở
            </p>
          </div>
        </section>

        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-muted/50">
            <h2 className="text-lg font-semibold text-foreground">
              Top 5 người dẫn đầu
            </h2>
          </div>
          <div className="divide-y divide-border">
            {MOCK_LEADERBOARD.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-gradient-primary/10 flex items-center justify-center text-primary font-bold">
                    #{item.rank}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Streak {item.streak} ngày
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {formatNumber(item.xp)} XP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hoàn thành 42 thẻ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
