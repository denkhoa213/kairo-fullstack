import { Link } from "react-router";
import {
  Eye,
  EyeOff,
  Layers,
  ArrowRight,
  Loader2,
  Code,
  Mail,
  CheckCircle,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import type { RegisterFormData } from "./schema/auth.schema";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";

const BENEFITS = [
  "Học với 6 chế độ đa dạng",
  "Spaced Repetition thông minh",
  "AI tạo Flashcard tự động",
  "Hàng ngàn bộ thẻ miễn phí",
  "Gamification & Leaderboard",
];

interface RegisterPageProps {
  // Form methods từ react-hook-form
  register: UseFormRegister<RegisterFormData>;
  handleSubmit: UseFormHandleSubmit<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;

  // Password visibility
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (value: boolean) => void;

  // Password strength
  passwordValue: string;
  strength: number;
  strengthColors: string[];
  strengthLabels: string[];

  // Submit
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
}

export default function RegisterPage({
  register,
  handleSubmit,
  errors,
  showPassword,
  setShowPassword,
  showConfirm,
  setShowConfirm,
  passwordValue,
  strength,
  strengthColors,
  strengthLabels,
  onSubmit,
  isLoading,
}: RegisterPageProps) {
  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-primary p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />

        <Link to="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-white">Kairo</span>
        </Link>

        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-3">
            Bắt đầu hành trình học tập của bạn
          </h2>
          <p className="text-white/70 text-base mb-8 leading-relaxed">
            Tham gia cùng 250.000+ học viên đang học hiệu quả mỗi ngày với
            Kairo.
          </p>
          <div className="flex flex-col gap-3">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/80 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            {["🧑‍🎓", "👩‍💻", "🧑‍🏫", "👨‍🎓", "👩‍🔬"].map((emoji, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg"
              >
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-white/60 text-sm">
            ⭐⭐⭐⭐⭐ Được đánh giá 4.9/5 bởi người dùng
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-background overflow-y-auto">
        <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold gradient-text">Kairo</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Tạo tài khoản miễn phí ✨
            </h1>
            <p className="text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all duration-200 text-sm font-medium text-foreground"
            >
              <Mail className="w-4.5 h-4.5 text-red-500" />
              Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-all duration-200 text-sm font-medium text-foreground"
            >
              <Code className="w-4.5 h-4.5" />
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground px-2">
              hoặc đăng ký bằng email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            {/* Họ và tên: 2 ô trên 1 hàng */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Họ và tên
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Nguyễn"
                    autoComplete="family-name"
                    {...register("lastName")}
                    className={cn(
                      "w-full px-4 py-3 rounded-2xl border bg-card focus:bg-background outline-none transition-all duration-200 text-sm",
                      errors.lastName
                        ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Văn A"
                    autoComplete="given-name"
                    {...register("firstName")}
                    className={cn(
                      "w-full px-4 py-3 rounded-2xl border bg-card focus:bg-background outline-none transition-all duration-200 text-sm",
                      errors.firstName
                        ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reg-email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className={cn(
                  "w-full px-4 py-3 rounded-2xl border bg-card focus:bg-background outline-none transition-all duration-200 text-sm",
                  errors.email
                    ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reg-password"
                className="text-sm font-medium text-foreground"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("password")}
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-2xl border bg-card focus:bg-background outline-none transition-all duration-200 text-sm",
                    errors.password
                      ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {/* Password strength */}
              {passwordValue && (
                <div className="flex gap-1 mt-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 h-1 rounded-full transition-colors duration-300",
                          i < strength ? strengthColors[strength] : "bg-muted",
                        )}
                      />
                    ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-2xl border bg-card focus:bg-background outline-none transition-all duration-200 text-sm",
                    errors.confirmPassword
                      ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold text-base shadow-primary hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Tạo tài khoản
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <a href="#" className="text-primary hover:underline">
              Điều khoản
            </a>{" "}
            và{" "}
            <a href="#" className="text-primary hover:underline">
              Chính sách bảo mật
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
