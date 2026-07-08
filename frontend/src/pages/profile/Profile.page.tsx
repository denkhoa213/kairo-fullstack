import { Link } from "react-router";
import {
  Settings,
  Flame,
  Trophy,
  BookOpen,
  Clock,
  Calendar,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DeckCard from "../../components/ui/DeckCard";
import useAuthStore from "../../stores/authStore";
import { fetchDashboardStats, fetchUserProfile } from "../../lib/flashcards";
import { useEffect, useState } from "react";
import { formatNumber, formatDuration } from "../../lib/utils";

export default function ProfilePage() {
  const { user: authUser } = useAuthStore();
  const [user, setUser] = useState(authUser ?? null);
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
        const [u, s] = await Promise.all([
          fetchUserProfile(),
          fetchDashboardStats(),
        ]);
        if (mounted) {
          if (u) setUser(u as any);
          setStats(s as any);
        }
      } catch (err) {
        console.error("Failed to load profile/stats", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 lg:p-8">
        {/* Header Profile Info */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative shadow-sm">
          <Link
            to="/settings"
            className="absolute top-6 right-6 p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>

          <div className="w-28 h-28 rounded-full bg-gradient-primary flex items-center justify-center text-4xl text-white font-bold shadow-md shrink-0">
            {isLoading ? (
              <div className="w-12 h-12 bg-muted-foreground rounded-full" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {isLoading ? "..." : user?.name}
            </h1>
            <p className="text-muted-foreground text-sm mb-4">
              {isLoading ? "..." : user?.email}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-lg text-sm font-medium">
                <Trophy className="w-4 h-4 text-yellow-500" /> Level{" "}
                {stats.level}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-lg text-sm font-medium">
                <Flame className="w-4 h-4 text-orange-500" /> {stats.streak}{" "}
                ngày streak
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent rounded-lg text-sm font-medium">
                <Calendar className="w-4 h-4 text-primary" /> Tham gia tháng 7,
                2026
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalCardsLearned)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Thẻ đã học</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <Clock className="w-6 h-6 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {formatDuration(stats.totalStudyTime * 60)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Thời gian học</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats.xp)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Tổng XP</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
            <p className="text-xs text-muted-foreground mt-1">Kỷ lục streak</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex items-center gap-6 border-b border-border">
            <button className="pb-3 text-sm font-semibold text-primary border-b-2 border-primary">
              Bộ thẻ của tôi (3)
            </button>
            <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">
              Đã lưu (12)
            </button>
            <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">
              Hoạt động gần đây
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <DeckCard key={set._id} set={set} />
                ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
