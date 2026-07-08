import { create } from "zustand";
import type { Flashcard, StudyMode } from "../types";
import { shuffle } from "../lib/utils";

interface StudyState {
  // Session info
  setId: string | null;
  setName: string;
  mode: StudyMode;
  cards: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
  isShuffled: boolean;

  // Progress
  known: string[];       // flashcard IDs
  unknown: string[];     // flashcard IDs
  correct: number;
  incorrect: number;
  startTime: number | null;

  // UI
  isComplete: boolean;
  isAutoPlay: boolean;
  isFullscreen: boolean;
}

interface StudyActions {
  startSession: (setId: string, setName: string, cards: Flashcard[], mode: StudyMode) => void;
  nextCard: () => void;
  prevCard: () => void;
  flipCard: () => void;
  markKnown: () => void;
  markUnknown: () => void;
  toggleShuffle: () => void;
  toggleAutoPlay: () => void;
  toggleFullscreen: () => void;
  restart: () => void;
  resetSession: () => void;
  setCurrentIndex: (index: number) => void;
  recordAnswer: (isCorrect: boolean) => void;
}

const useStudyStore = create<StudyState & StudyActions>()((set, get) => ({
  setId: null,
  setName: "",
  mode: "flashcard",
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  isShuffled: false,
  known: [],
  unknown: [],
  correct: 0,
  incorrect: 0,
  startTime: null,
  isComplete: false,
  isAutoPlay: false,
  isFullscreen: false,

  startSession: (setId, setName, cards, mode) => {
    set({
      setId,
      setName,
      mode,
      cards,
      currentIndex: 0,
      isFlipped: false,
      known: [],
      unknown: [],
      correct: 0,
      incorrect: 0,
      startTime: Date.now(),
      isComplete: false,
      isAutoPlay: false,
    });
  },

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

  flipCard: () => {
    set((state) => ({ isFlipped: !state.isFlipped }));
  },

  markKnown: () => {
    const { cards, currentIndex, known } = get();
    const card = cards[currentIndex];
    if (card && !known.includes(card._id)) {
      set((state) => ({ known: [...state.known, card._id] }));
    }
    get().nextCard();
  },

  markUnknown: () => {
    const { cards, currentIndex, unknown } = get();
    const card = cards[currentIndex];
    if (card && !unknown.includes(card._id)) {
      set((state) => ({ unknown: [...state.unknown, card._id] }));
    }
    get().nextCard();
  },

  toggleShuffle: () => {
    const { cards, isShuffled } = get();
    const newCards = isShuffled ? [...cards].sort((a, b) => a.order - b.order) : shuffle(cards);
    set({ cards: newCards, isShuffled: !isShuffled, currentIndex: 0, isFlipped: false });
  },

  toggleAutoPlay: () => {
    set((state) => ({ isAutoPlay: !state.isAutoPlay }));
  },

  toggleFullscreen: () => {
    set((state) => ({ isFullscreen: !state.isFullscreen }));
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  },

  restart: () => {
    set({
      currentIndex: 0,
      isFlipped: false,
      known: [],
      unknown: [],
      correct: 0,
      incorrect: 0,
      startTime: Date.now(),
      isComplete: false,
    });
  },

  resetSession: () => {
    set({
      setId: null,
      setName: "",
      cards: [],
      currentIndex: 0,
      isFlipped: false,
      isShuffled: false,
      known: [],
      unknown: [],
      correct: 0,
      incorrect: 0,
      startTime: null,
      isComplete: false,
      isAutoPlay: false,
      isFullscreen: false,
    });
  },

  setCurrentIndex: (index) => {
    set({ currentIndex: index, isFlipped: false });
  },

  recordAnswer: (isCorrect) => {
    if (isCorrect) {
      set((state) => ({ correct: state.correct + 1 }));
    } else {
      set((state) => ({ incorrect: state.incorrect + 1 }));
    }
  },
}));

export default useStudyStore;
