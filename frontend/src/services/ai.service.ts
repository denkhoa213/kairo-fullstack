import api from "@/lib/axios";

export interface GenerateFlashcardsInput {
  topic?: string;          // e.g. "IELTS Vocabulary"
  text?: string;           // paste raw text → extract cards
  language?: string;       // "vi" | "en" | "ja"
  count?: number;          // how many cards to generate (5-50)
  level?: string;          // "beginner" | "intermediate" | "advanced"
}

export interface GeneratedCard {
  front: string;
  back: string;
}

export interface GenerateResponse {
  cards: GeneratedCard[];
  model: string;
  totalGenerated: number;
}

export const aiService = {
  /**
   * Generate flashcards using AI.
   * If `text` is provided, extracts key concepts.
   * Otherwise generates based on `topic`.
   */
  generateFlashcards: async (input: GenerateFlashcardsInput): Promise<GenerateResponse> => {
    const response = await api.post("/ai/generate", input);
    return response.data?.data;
  },
};
