import type { User } from "./user.type";
import type { FlashcardSet, Flashcard, StudyProgress } from "./entities.types";

// ===== Auth Store =====
export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// ===== Flashcard Store =====
export interface FlashcardState {
  // Browse / list
  sets: FlashcardSet[];
  totalSets: number;
  currentPage: number;
  isLoadingSets: boolean;

  // My sets
  mySets: FlashcardSet[];
  isLoadingMySets: boolean;

  // Current set detail
  currentSet: FlashcardSet | null;
  currentCards: Flashcard[];
  isLoadingDetail: boolean;

  // Actions
  fetchSets: (params?: { search?: string; category?: string; sort?: string; page?: number }) => Promise<void>;
  fetchMySets: () => Promise<void>;
  fetchSetDetail: (id: string) => Promise<void>;
  createSet: (data: {
    name: string;
    description?: string;
    categoryId?: string;
    isPublic?: boolean;
    cards: { front: string; back: string }[];
  }) => Promise<FlashcardSet | null>;
  deleteSet: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  clearCurrentSet: () => void;
}

// ===== Study Store =====
export type StudyModeType = "flashcard" | "learn" | "write" | "test" | "match" | "speed";

export interface StudyCard {
  _id: string;
  front: string;
  back: string;
  state?: "new" | "learning" | "review" | "mastered";
}

export interface StudyState {
  // Session info
  setId: string | null;
  setName: string;
  mode: StudyModeType | null;
  cards: StudyCard[];
  currentIndex: number;

  // Local UI state
  isFlipped: boolean;
  isAutoPlay: boolean;
  isFullscreen: boolean;

  // Progress counters
  known: number;
  unknown: number;
  knownCount: number;
  unknownCount: number;
  isComplete: boolean;
  startTime: number | null;

  // Progress from API
  progressMap: Record<string, StudyProgress>;

  // Session actions
  startSession: (setId: string, setName: string, cards: StudyCard[], mode: StudyModeType) => void;
  nextCard: () => void;
  prevCard: () => void;
  flipCard: () => void;
  markKnown: () => void;
  markUnknown: () => void;
  toggleAutoPlay: () => void;
  toggleShuffle: () => void;
  toggleFullscreen: () => void;
  restart: () => void;
  resetSession: () => void;

  // API actions
  submitReview: (flashcardId: string, correct: boolean, quality?: number) => Promise<void>;
  completeSession: (mode: StudyModeType) => Promise<{ xpEarned: number; score: number } | null>;
}

// ===== AI Store =====
export interface AIState {
  isGenerating: boolean;
  generatedCards: { front: string; back: string }[];
  error: string | null;
  generate: (input: { topic?: string; text?: string; language?: string; count?: number }) => Promise<void>;
  clearGenerated: () => void;
}
