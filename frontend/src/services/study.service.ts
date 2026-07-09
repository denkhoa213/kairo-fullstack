import api from "@/lib/axios";

export interface StudyStats {
  totalCards: number;
  masteredCards: number;
  streak: number;
  totalStudyTime: number;
  totalCardsReviewed: number;
  recentSessions: ReviewSession[];
}

export interface ReviewSession {
  _id: string;
  setId: string;
  mode: string;
  cardsReviewed: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  durationSeconds: number;
  xpEarned: number;
  createdAt: string;
}

export interface DueCardsResponse {
  dueCards: { _id: string; front: string; back: string }[];
  total: number;
  allTotal: number;
}

export interface SessionCompleteResult {
  xpEarned: number;
  score: number;
}

export const studyService = {
  /** Get aggregate study stats for the dashboard */
  getStats: async (): Promise<StudyStats> => {
    const response = await api.get("/study/stats");
    return response.data?.data;
  },

  /** Get cards due for spaced repetition review in a set */
  getDueCards: async (setId: string): Promise<DueCardsResponse> => {
    const response = await api.get(`/study/${setId}/due`);
    return response.data?.data;
  },

  /**
   * Submit the result of reviewing one card.
   * @param quality Optional 0-5 rating for SM-2 granularity; if omitted, uses boolean `correct`.
   */
  reviewCard: async (data: {
    flashcardId: string;
    setId: string;
    correct: boolean;
    quality?: number;
  }): Promise<void> => {
    await api.post("/study/review", data);
  },

  /** Mark a full session as complete and earn XP */
  completeSession: async (data: {
    setId: string;
    mode: string;
    cardsReviewed: number;
    correctCount: number;
    incorrectCount: number;
    durationSeconds: number;
  }): Promise<SessionCompleteResult> => {
    const response = await api.post("/study/session/complete", data);
    return response.data?.data;
  },
};
