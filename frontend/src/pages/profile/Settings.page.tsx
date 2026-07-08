import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  LogOut,
  CheckCircle,
  Smartphone,
  Monitor,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useAuthStore from "../../stores/authStore";
import useThemeStore from "../../stores/themeStore";
import { cn } from "../../lib/utils";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save profile
    alert("Đã lưu thông tin");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">
          Cài đặt & Tài khoản
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation sidebar for settings */}
          <div className="lg:col-span-1 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium transition-colors text-left">
              <User className="w-5 h-5" /> Thông tin cá nhân
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors text-left">
              <Shield className="w-5 h-5" /> Bảo mật
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors text-left">
              <Bell className="w-5 h-5" /> Thông báo
            </button>

            <div className="h-px bg-border my-4 mx-2" />

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive font-medium transition-colors text-left"
            >
              <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Section 1: Profile */}
            <section className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-6">
                Thông tin cá nhân
              </h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-3xl text-white font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <button className="px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors mb-2">
                    Đổi ảnh đại diện
                  </button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF hoặc PNG. Tối đa 2MB.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </section>

            {/* Section 2: Appearance (Theme) */}
            <section className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-2">
                Giao diện
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Tùy chỉnh giao diện hiển thị của Kairo.
              </p>

              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                    <Monitor className="w-8 h-8 text-gray-400" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      theme === "light" ? "text-primary" : "text-foreground",
                    )}
                  >
                    Sáng
                  </span>
                </button>

                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="w-full aspect-[4/3] rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
                    <Monitor className="w-8 h-8 text-gray-600" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      theme === "dark" ? "text-primary" : "text-foreground",
                    )}
                  >
                    Tối
                  </span>
                </button>

                <button
                  onClick={() => setTheme("system")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                    theme === "system"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <div className="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-gray-100 to-gray-900 flex items-center justify-center border border-border overflow-hidden">
                    <Smartphone className="w-8 h-8 text-white mix-blend-difference" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      theme === "system" ? "text-primary" : "text-foreground",
                    )}
                  >
                    Hệ thống
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
