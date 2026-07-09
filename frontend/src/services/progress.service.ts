import api from "@/lib/axios";
import type { StudyProgress } from "@/types/entities.types";

export interface ProgressSummary {
  total: number;
  new: number;
  learning: number;
  review: number;
  mastered: number;
}

export interface SetProgressResponse {
  progress: StudyProgress[];
  summary: ProgressSummary;
}

export const progressService = {
  /** Get per-card progress for a specific set */
  getSetProgress: async (setId: string): Promise<SetProgressResponse> => {
    const response = await api.get(`/progress/${setId}`);
    return response.data?.data;
  },

  /** Reset all progress for a set (start from scratch) */
  resetSetProgress: async (setId: string): Promise<void> => {
    await api.delete(`/progress/${setId}/reset`);
  },
};
