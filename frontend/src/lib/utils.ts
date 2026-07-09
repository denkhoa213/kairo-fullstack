import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return formatDate(d);
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function getInitials(name: string): string {
  if (!name || !name.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
export function normalizeAnswer(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9àáâãèéêìíòóôõùúýăđơư\s]/gi, "")
    .replace(/\s+/g, " ");
}

export function checkAnswer(userAnswer: string, correct: string): boolean {
  return normalizeAnswer(userAnswer) === normalizeAnswer(correct);
}

export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function isSimilarAnswer(userAnswer: string, correct: string): boolean {
  const a = normalizeAnswer(userAnswer);
  const b = normalizeAnswer(correct);
  if (a === b) return true;
  const dist = levenshteinDistance(a, b);
  const threshold = Math.floor(b.length * 0.2); // 20% tolerance
  return dist <= threshold;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Tiếng Anh": "from-blue-500 to-cyan-500",
    "Tiếng Nhật": "from-red-500 to-pink-500",
    "Lập trình": "from-violet-500 to-purple-500",
    Toán: "from-orange-500 to-amber-500",
    Marketing: "from-green-500 to-emerald-500",
    "Kinh tế": "from-yellow-500 to-orange-500",
    "Hóa học": "from-teal-500 to-cyan-500",
    "Vật lý": "from-indigo-500 to-blue-500",
    default: "from-primary to-secondary",
  };
  return colors[category] ?? colors.default;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "Tiếng Anh": "🇬🇧",
    "Tiếng Nhật": "🇯🇵",
    "Lập trình": "💻",
    Toán: "📐",
    Marketing: "📈",
    "Kinh tế": "💰",
    "Hóa học": "⚗️",
    "Vật lý": "⚡",
    default: "📚",
  };
  return icons[category] ?? icons.default;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
