import api from "@/lib/axios";
import type { FlashcardSet } from "@/types/entities.types";

export interface SetListParams {
  search?: string;
  category?: string;
  sort?: "newest" | "popular" | "rating";
  page?: number;
  limit?: number;
}

export interface SetListResponse {
  items: FlashcardSet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const flashcardSetService = {
  /** List public sets — browse/discover page */
  list: async (params?: SetListParams): Promise<SetListResponse> => {
    const response = await api.get("/sets", { params });
    return response.data?.data;
  },

  /** Get sets created by the current authenticated user */
  getMySets: async (): Promise<FlashcardSet[]> => {
    const response = await api.get("/sets/my");
    return response.data?.data ?? [];
  },

  /** Create a new flashcard set */
  create: async (data: {
    name: string;
    description?: string;
    categoryId?: string;
    isPublic?: boolean;
    tags?: string[];
    cards?: { front: string; back: string }[];
  }): Promise<FlashcardSet> => {
    const response = await api.post("/sets", data);
    return response.data?.data;
  },

  /** Update metadata of a set */
  update: async (id: string, data: Partial<FlashcardSet>): Promise<FlashcardSet> => {
    const response = await api.put(`/sets/${id}`, data);
    return response.data?.data;
  },

  /** Delete a set and all its cards */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sets/${id}`);
  },

  /** Toggle like on a set */
  toggleLike: async (id: string, liked: boolean): Promise<{ favoriteCount: number }> => {
    const response = await api.post(`/sets/${id}/like`, { liked });
    return response.data;
  },
};
