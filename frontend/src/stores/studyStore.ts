import { create } from "zustand";
import { toast } from "sonner";
import { studyService } from "@/services/study.service";
import type { StudyModeType, StudyCard } from "@/types/store.type";

interface StudyStore {
  // Session info
  setId: string | null;
  setName: string;
  mode: StudyModeType | null;
  cards: StudyCard[];
  currentIndex: number;

  // Flip state (local UI)
  isFlipped: boolean;

  // Progress
  known: number;       // alias for knownCount (for backward compat)
  unknown: number;     // alias for unknownCount
  knownCount: number;
  unknownCount: number;
  isComplete: boolean;
  startTime: number | null;

  // UI flags
  isAutoPlay: boolean;
  isFullscreen: boolean;
  progressMap: Record<string, { state?: string }>;

  // Session Actions
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

  // API Actions
  submitReview: (flashcardId: string, correct: boolean, quality?: number) => Promise<void>;
  completeSession: (mode: StudyModeType) => Promise<{ xpEarned: number; score: number } | null>;
}

const initialState = {
  setId: null,
  setName: "",
  mode: null,
  cards: [] as StudyCard[],
  currentIndex: 0,
  isFlipped: false,
  known: 0,
  unknown: 0,
  knownCount: 0,
  unknownCount: 0,
  isComplete: false,
  startTime: null,
  isAutoPlay: false,
  isFullscreen: false,
  progressMap: {},
};

export const useStudyStore = create<StudyStore>((set, get) => ({
  ...initialState,

  startSession: (setId, setName, cards, mode) => {
    set({
      setId,
      setName,
      cards,
      mode,
      currentIndex: 0,
      isFlipped: false,
      known: 0,
      unknown: 0,
      knownCount: 0,
      unknownCount: 0,
      isComplete: false,
      startTime: Date.now(),
      progressMap: {},
    });
  },

  flipCard: () => set((s) => ({ isFlipped: !s.isFlipped })),

  nextCard: () => {
    const { currentIndex, cards } = get();
    if (currentIndex < cards.length - 1) {
      set({ currentIndex: currentIndex + 1, isFlipped: false });
    } else {
      set({ isComplete: true });
    }
  },

  prevCard: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, isFlipped: false });
    }
  },

  markKnown: () => {
    set((s) => ({
      known: s.known + 1,
      knownCount: s.knownCount + 1,
      isFlipped: false,
    }));
    get().nextCard();
  },

  markUnknown: () => {
    set((s) => ({
      unknown: s.unknown + 1,
      unknownCount: s.unknownCount + 1,
      isFlipped: false,
    }));
    get().nextCard();
  },

  toggleAutoPlay: () => set((s) => ({ isAutoPlay: !s.isAutoPlay })),

  toggleShuffle: () => {
    const { cards } = get();
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    set({ cards: shuffled, currentIndex: 0, isFlipped: false });
  },

  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),

  restart: () => {
    const { cards } = get();
    set({
      currentIndex: 0,
      isFlipped: false,
      known: 0,
      unknown: 0,
      knownCount: 0,
      unknownCount: 0,
      isComplete: false,
      startTime: Date.now(),
      cards: [...cards], // preserve cards
    });
  },

  resetSession: () => set({ ...initialState }),

  // ── API calls ────────────────────────────────────────────────────────────
  submitReview: async (flashcardId, correct, quality) => {
    const { setId } = get();
    if (!setId) return;
    try {
      await studyService.reviewCard({ flashcardId, setId, correct, quality });
    } catch (err) {
      console.warn("Review card API error:", err);
    }
  },

  completeSession: async (mode: StudyModeType) => {
    const { setId, knownCount, unknownCount, startTime } = get();
    if (!setId) return null;

    const cardsReviewed = knownCount + unknownCount;
    const durationSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    try {
      const result = await studyService.completeSession({
        setId,
        mode,
        cardsReviewed,
        correctCount: knownCount,
        incorrectCount: unknownCount,
        durationSeconds,
      });
      toast.success(`+${result.xpEarned} XP! Hoàn thành phiên học 🎉`);
      return result;
    } catch (err) {
      console.warn("Complete session error:", err);
      return null;
    }
  },
}));

// Default export for backward compatibility
export default useStudyStore;
