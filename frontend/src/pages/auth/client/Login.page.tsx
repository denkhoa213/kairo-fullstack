import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Layers, Loader2, ArrowRight, Code, Mail } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "../../../stores/authStore";
import { cn } from "../../../lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Đăng nhập thành công! 🎉");
      navigate("/dashboard");
    } catch {
      toast.error("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — illustration */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-primary p-12 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-white">Kairo</span>
        </Link>

        {/* Center content */}
        <div className="relative flex-1 flex flex-col items-center justify-center gap-8 py-12">
          {/* Floating cards */}
          <div className="relative w-full max-w-sm">
            <div className="absolute -top-4 -left-4 w-56 h-32 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-col items-center justify-center gap-2 animate-float">
              <p className="text-white font-bold text-lg">Ephemeral</p>
              <p className="text-white/70 text-sm">Lasting for a short time</p>
            </div>
            <div className="absolute top-8 right-0 w-56 h-32 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 flex flex-col items-center justify-center gap-2 animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-2xl">🔥 12</div>
              <p className="text-white/80 text-sm font-medium">Streak ngày học</p>
            </div>
            <div className="mt-32 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 p-5 animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🏆</div>
                <div>
                  <p className="text-white font-semibold text-sm">Hoàn thành 50 thẻ!</p>
                  <p className="text-white/60 text-xs">+100 XP earned</p>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/20">
                <div className="h-full w-2/3 bg-white rounded-full" />
              </div>
              <p className="text-white/70 text-xs mt-1.5">Level 8 → 9 (68%)</p>
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <blockquote className="text-white/80 text-sm italic leading-relaxed">
            "Việc học không bao giờ làm mệt mỏi trí óc. Chỉ có việc bị ép buộc học mới làm vậy."
          </blockquote>
          <p className="text-white/50 text-xs mt-2">— Leonardo da Vinci</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-background">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold gradient-text">Kairo</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Chào mừng trở lại 👋</h1>
            <p className="text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Đăng ký miễn phí
              </Link>
            </p>
          </div>

          {/* Social logins */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all duration-200 text-sm font-medium text-foreground"
            >
              <Mail className="w-5 h-5 text-red-500" />
              Tiếp tục với Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all duration-200 text-sm font-medium text-foreground"
            >
              <Code className="w-5 h-5" />
              Tiếp tục với GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-2">hoặc đăng nhập bằng email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className={cn(
                  "w-full px-4 py-3 rounded-2xl border bg-card focus:bg-background outline-none transition-all duration-200 text-sm",
                  errors.email
                    ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-2xl border bg-card focus:bg-background outline-none transition-all duration-200 text-sm",
                    errors.password
                      ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold text-base shadow-primary hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="text-primary hover:underline">Điều khoản</a>
            {" "}và{" "}
            <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>
            {" "}của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}
