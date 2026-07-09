import type { User } from "./user.types";

// ===== Domain Types =====
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
  imageFront?: string;
  imageBack?: string;
  frontAudio?: string;
  backAudio?: string;
  example?: string;
  hint?: string;
  order: number;
  // Study state (populated from Progress model)
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

export interface Achievement {
  _id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  tier?: number;
  earnedAt?: string;
  isUnlocked?: boolean;
}

export interface Notification {
  _id: string;
  userId: string;
  type: "follow" | "like" | "comment" | "study_reminder" | "achievement" | "system";
  title: string;
  content: string;
  isRead: boolean;
  relatedId?: string;
  link?: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  user?: Pick<User, "_id" | "name" | "avatar">;
  setId: string;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
}
