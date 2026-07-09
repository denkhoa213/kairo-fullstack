// ===== API Response Types =====
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ===== Study Mode Types =====
export type StudyMode = "flashcard" | "learn" | "write" | "test" | "match" | "speed";

export interface TestQuestion {
  id: string;
  type: "multiple-choice" | "true-false" | "fill-blank" | "matching";
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation?: string;
  flashcardId: string;
}

export interface TestResult {
  score: number;
  correct: number;
  incorrect: number;
  total: number;
  duration: number;
  answers: {
    questionId: string;
    userAnswer: string | boolean;
    isCorrect: boolean;
  }[];
}

export interface MatchItem {
  id: string;
  content: string;
  type: "term" | "definition";
  flashcardId: string;
  isMatched: boolean;
  isSelected: boolean;
}

// ===== Dashboard Types =====
export interface DashboardStats {
  streak: number;
  totalCardsLearned: number;
  cardsDueToday: number;
  totalStudyTime: number;
  weeklyProgress: number[];
  recentSets: import("./entities.types").FlashcardSet[];
  xp: number;
  level: number;
  xpToNextLevel: number;
}

// ===== Form Types =====
export interface CreateSetForm {
  name: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
  isPublic: boolean;
  image?: string;
}

export interface CreateFlashcardForm {
  front: string;
  back: string;
  imageFront?: string;
  imageBack?: string;
  example?: string;
  hint?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ===== Filter Types =====
export interface SetFilters {
  search?: string;
  categoryId?: string;
  tag?: string;
  sortBy?: "newest" | "popular" | "rating" | "name";
  page?: number;
  limit?: number;
}
