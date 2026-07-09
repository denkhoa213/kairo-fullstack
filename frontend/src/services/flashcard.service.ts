import api from "@/lib/axios";
import type { Flashcard, FlashcardSet } from "@/types/entities.types";

export interface SetWithCards {
  set: FlashcardSet;
  flashcards: Flashcard[];
}

export const flashcardService = {
  /** Get a single set with its full card list */
  getSetWithCards: async (id: string): Promise<SetWithCards> => {
    const response = await api.get(`/sets/${id}`);
    return response.data?.data;
  },

  /** Get all cards for a set (without the set metadata) */
  getBySetId: async (setId: string): Promise<Flashcard[]> => {
    const response = await api.get(`/sets/${setId}/cards`);
    return response.data?.data ?? [];
  },

  /** Bulk create cards in a set */
  bulkCreate: async (
    setId: string,
    cards: { front: string; back: string; order?: number }[]
  ): Promise<Flashcard[]> => {
    const response = await api.post(`/sets/${setId}/cards`, { cards });
    return response.data?.data ?? [];
  },

  /** Update a single card */
  update: async (id: string, data: Partial<Flashcard>): Promise<Flashcard> => {
    const response = await api.put(`/cards/${id}`, data);
    return response.data?.data;
  },

  /** Delete a single card */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/cards/${id}`);
  },
};
