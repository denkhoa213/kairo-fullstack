import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  BookOpen,
  LogOut,
  Settings,
  User,
  ChevronDown,
  Sparkles,
  Layers,
  Plus,
} from "lucide-react";
import { cn, getInitials } from "../../lib/utils";
import useAuthStore from "../../stores/authStore";
import useThemeStore from "../../stores/themeStore";

const NAV_LINKS = [
  { href: "/sets", label: "Khám phá" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/sets?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-xs"
          : "bg-transparent",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm group-hover:shadow-primary transition-shadow duration-300">
              <Layers className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Kairo
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bộ thẻ..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-accent/50 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 placeholder:text-muted-foreground"
              />
            </div>
          </form>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4.5 h-4.5" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Create button */}
                <Link
                  to="/create"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-sm btn-glow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo thẻ</span>
                </Link>

                {/* Notification bell */}
                <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-accent transition-all duration-200"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-semibold">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user.name.split(" ").pop()}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                        isUserMenuOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-2xl shadow-lg overflow-hidden animate-scale-in">
                      <div className="px-3 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                        {/* Streak */}
                        {user.streak > 0 && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="text-sm">🔥</span>
                            <span className="text-xs font-medium text-warning">
                              {user.streak} ngày
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors duration-150"
                        >
                          <User className="w-4 h-4 text-muted-foreground" />
                          Hồ sơ của tôi
                        </Link>
                        <Link
                          to="/create"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors duration-150"
                        >
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          Bộ thẻ của tôi
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors duration-150"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          Cài đặt
                        </Link>
                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors duration-150"
                          >
                            <Sparkles className="w-4 h-4 text-muted-foreground" />
                            Admin
                          </Link>
                        )}
                      </div>
                      <div className="p-1 border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/8 transition-colors duration-150"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-3 animate-slide-in-up">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bộ thẻ..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-accent/50 focus:bg-background focus:border-primary outline-none transition-all duration-200"
                />
              </div>
            </form>
            {/* Mobile links */}
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    location.pathname === link.href
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/create"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/8 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Tạo bộ thẻ mới
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
}
