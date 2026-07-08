import { Link } from "react-router";
import { Layers, Heart, Code } from "lucide-react";

const FOOTER_LINKS = {
  product: [
    { href: "/sets", label: "Khám phá" },
    { href: "/create", label: "Tạo bộ thẻ" },
    { href: "/dashboard", label: "Dashboard" },
  ],
  study: [
    { href: "/sets", label: "Flashcard Mode" },
    { href: "/sets", label: "Learn Mode" },
    { href: "/sets", label: "Test Mode" },
    { href: "/sets", label: "Match Game" },
  ],
  categories: [
    { href: "/sets?category=tieng-anh", label: "Tiếng Anh" },
    { href: "/sets?category=tieng-nhat", label: "Tiếng Nhật" },
    { href: "/sets?category=lap-trinh", label: "Lập trình" },
    { href: "/sets?category=toan", label: "Toán học" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm">
                <Layers className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold gradient-text">Kairo</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Nền tảng học tập thông minh với Flashcard, Spaced Repetition và AI
              — giúp bạn ghi nhớ mọi thứ hiệu quả hơn.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              ></a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              >
                <Code className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Sản phẩm
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Chế độ học
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.study.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Danh mục
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            © 2025 Kairo. Made with
            <Heart className="w-3 h-3 text-destructive fill-destructive" />
            in Vietnam.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Điều khoản
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
