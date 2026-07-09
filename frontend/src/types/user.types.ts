// ===== User Types =====
export interface User {
  _id: string;
  email: string;
  displayName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: "user" | "admin" | "premium";
  streak: number;
  lastStudyDate?: string;
  totalStudyTime: number;
  totalCardsLearned: number;
  settings: {
    theme: "light" | "dark" | "system";
    language: string;
    emailNotifications: boolean;
  };
  xp?: number;
  level?: number;
  createdAt: string;
}
