import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useThemeStore from "../../stores/themeStore";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Ensure theme is applied on mount
    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolved);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
