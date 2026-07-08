import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  Settings,
  Flame,
  Trophy,
  BarChart2,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn, getInitials } from "../../lib/utils";
import useAuthStore from "../../stores/authStore";
import Navbar from "./Navbar";

const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sets", label: "Khám phá", icon: BookOpen },
  { href: "/create", label: "Tạo bộ thẻ", icon: Plus },
  { href: "/leaderboard", label: "Xếp hạng", icon: Trophy },
  { href: "/stats", label: "Thống kê", icon: BarChart2 },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-border bg-card overflow-y-auto">
          {/* User summary */}
          {user && (
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3 mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              {/* Streak + Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-accent/60 rounded-xl p-2.5 text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-sm font-bold text-foreground">{user.streak}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Streak</p>
                </div>
                <div className="bg-accent/60 rounded-xl p-2.5 text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-sm font-bold text-foreground">{user.totalCardsLearned}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Đã học</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex-1 p-3">
            <div className="space-y-0.5">
              {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    location.pathname === href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4.5 h-4.5 transition-colors duration-200",
                      location.pathname === href ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {label}
                  {location.pathname === href && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Settings at bottom */}
          <div className="p-3 border-t border-border">
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                location.pathname === "/settings"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Settings className="w-4.5 h-4.5" />
              Cài đặt
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
