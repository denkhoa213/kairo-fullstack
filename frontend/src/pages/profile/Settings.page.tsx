import { LogOut, CheckCircle, Monitor, Eye, EyeOff, Loader2, User, Shield, Bell } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useThemeStore from "../../stores/themeStore";
import { useSettings } from "@/hooks/profile/useSettings";
import { useState } from "react";
import { cn } from "../../lib/utils";

type Tab = "profile" | "security" | "notifications";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const {
    user,
    profileForm,
    onSaveProfile,
    isSavingProfile,
    passwordForm,
    onChangePassword,
    isSavingPassword,
    showCurrent, setShowCurrent,
    showNew, setShowNew,
    showConfirm, setShowConfirm,
    handleLogout,
  } = useSettings();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Thông tin cá nhân", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Bảo mật", icon: <Shield className="w-4 h-4" /> },
    { id: "notifications", label: "Thông báo", icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-foreground mb-8">Cài đặt & Tài khoản</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left text-sm",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className="h-px bg-border my-4 mx-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive font-medium transition-colors text-left text-sm"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* ── Profile Tab ──────────────────────────────────── */}
            {activeTab === "profile" && (
              <>
                <section className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-lg font-bold text-foreground mb-6">Thông tin cá nhân</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-3xl text-white font-bold shadow-md shrink-0">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <button className="px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-accent transition-colors mb-2">
                        Đổi ảnh đại diện
                      </button>
                      <p className="text-xs text-muted-foreground">JPG, GIF hoặc PNG. Tối đa 2MB.</p>
                    </div>
                  </div>

                  {/* Profile form */}
                  <form onSubmit={onSaveProfile} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Họ và tên</label>
                        <input
                          {...profileForm.register("name")}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary outline-none transition-colors"
                        />
                        {profileForm.formState.errors.name && (
                          <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input
                          value={user?.email}
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted text-muted-foreground outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Giới thiệu bản thân</label>
                      <textarea
                        {...profileForm.register("bio")}
                        rows={3}
                        placeholder="Viết vài dòng về bản thân..."
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-60"
                      >
                        {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Lưu thay đổi
                      </button>
                    </div>
                  </form>
                </section>

                {/* Appearance */}
                <section className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-lg font-bold text-foreground mb-2">Giao diện</h2>
                  <p className="text-sm text-muted-foreground mb-6">Tùy chỉnh giao diện hiển thị của Kairo.</p>
                  <div className="grid grid-cols-3 gap-4">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                          theme === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className={cn(
                          "w-full aspect-[4/3] rounded-lg flex items-center justify-center border",
                          t === "light" ? "bg-gray-100 border-gray-200" :
                          t === "dark" ? "bg-gray-900 border-gray-800" :
                          "bg-gradient-to-br from-gray-100 to-gray-900 border-border"
                        )}>
                          <Monitor className={cn("w-8 h-8", t === "dark" ? "text-gray-600" : "text-gray-400")} />
                        </div>
                        <span className={cn("text-sm font-medium", theme === t ? "text-primary" : "text-foreground")}>
                          {t === "light" ? "Sáng" : t === "dark" ? "Tối" : "Hệ thống"}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* ── Security Tab ─────────────────────────────────── */}
            {activeTab === "security" && (
              <section className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">Đổi mật khẩu</h2>

                <form onSubmit={onChangePassword} className="space-y-4 max-w-sm">
                  {/* Current password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        {...passwordForm.register("currentPassword")}
                        className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background focus:border-primary outline-none transition-colors"
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Mật khẩu mới</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        {...passwordForm.register("newPassword")}
                        className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background focus:border-primary outline-none transition-colors"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Xác nhận mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        {...passwordForm.register("confirmPassword")}
                        className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background focus:border-primary outline-none transition-colors"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    Cập nhật mật khẩu
                  </button>
                </form>
              </section>
            )}

            {/* ── Notifications Tab ────────────────────────────── */}
            {activeTab === "notifications" && (
              <section className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">Cài đặt thông báo</h2>
                <div className="space-y-4">
                  {[
                    { label: "Nhắc nhở học hàng ngày", desc: "Nhận thông báo nhắc học mỗi ngày" },
                    { label: "Thẻ đến hạn ôn tập", desc: "Thông báo khi có thẻ cần ôn lại" },
                    { label: "Hoạt động xã hội", desc: "Khi ai đó like hoặc bình luận bộ thẻ của bạn" },
                    { label: "Email cập nhật sản phẩm", desc: "Tính năng mới và thông báo từ Kairo" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                        <div className="w-11 h-6 bg-muted peer-checked:bg-primary rounded-full peer-focus:ring-2 peer-focus:ring-primary/30 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
