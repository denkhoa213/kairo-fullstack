// ===== Core Types for Kairo =====

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: "user" | "admin";
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

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  deckCount?: number;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export interface Flashcard {
  _id: string;
  setId: string;
  front: string;
  back: string;
  frontImage?: string;
  backImage?: string;
  frontAudio?: string;
  backAudio?: string;
  example?: string;
  hint?: string;
  order: number;
  // Study state
  state?: "new" | "learning" | "review" | "mastered";
  nextReviewDate?: string;
  easeFactor?: number;
  interval?: number;
}

export interface FlashcardSet {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  userId: string;
  author?: Pick<User, "_id" | "name" | "avatar">;
  categoryId: string;
  category?: Category;
  tags?: Tag[];
  isPublic: boolean;
  visibility?: "public" | "private" | "link";
  totalCards: number;
  favoriteCount: number;
  viewCount?: number;
  rating: number;
  bookmarkCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudyProgress {
  _id: string;
  userId: string;
  setId: string;
  flashcardId: string;
  state: "new" | "learning" | "review" | "mastered";
  nextReviewDate: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  lastReviewDate?: string;
}

export interface StudySession {
  _id: string;
  userId: string;
  setId: string;
  mode: "flashcard" | "learn" | "write" | "test" | "match" | "speed";
  cardsStudied: number;
  correct: number;
  incorrect: number;
  duration: number;
  score?: number;
  completedAt: string;
}

export interface Achievement {
  _id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  earnedAt?: string;
  isUnlocked?: boolean;
}

export interface Notification {
  _id: string;
  userId: string;
  type: "follow" | "like" | "comment" | "review_due" | "achievement" | "system";
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  user?: Pick<User, "_id" | "name" | "avatar">;
  setId: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Study Mode types
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

// Dashboard stats
export interface DashboardStats {
  streak: number;
  totalCardsLearned: number;
  cardsDueToday: number;
  totalStudyTime: number;
  weeklyProgress: number[];
  recentSets: FlashcardSet[];
  xp: number;
  level: number;
  xpToNextLevel: number;
}

// Match game types
export interface MatchItem {
  id: string;
  content: string;
  type: "term" | "definition";
  flashcardId: string;
  isMatched: boolean;
  isSelected: boolean;
}

// Form types
export interface CreateSetForm {
  name: string;
  description?: string;
  categoryId: string;
  tags?: string[];
  isPublic: boolean;
  visibility: "public" | "private" | "link";
  image?: string;
}

export interface CreateFlashcardForm {
  front: string;
  back: string;
  frontImage?: string;
  backImage?: string;
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

// Filter types
export interface SetFilters {
  search?: string;
  categoryId?: string;
  tag?: string;
  sortBy?: "newest" | "popular" | "rating" | "name";
  page?: number;
  limit?: number;
}
