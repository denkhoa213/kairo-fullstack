import { create } from "zustand";
import { toast } from "sonner";
import { aiService, type GeneratedCard } from "@/services/ai.service";
import type { AIState } from "@/types/store.type";

export const useAIStore = create<AIState>((set) => ({
  isGenerating: false,
  generatedCards: [] as GeneratedCard[],
  error: null,

  generate: async (input) => {
    set({ isGenerating: true, error: null, generatedCards: [] });
    try {
      const result = await aiService.generateFlashcards({
        topic: input.topic,
        text: input.text,
        language: input.language ?? "vi",
        count: input.count ?? 20,
        level: "intermediate",
      });
      set({ generatedCards: result.cards });
      toast.success(`✨ Đã tạo ${result.cards.length} thẻ bằng AI!`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Tạo thẻ bằng AI thất bại";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isGenerating: false });
    }
  },

  clearGenerated: () => set({ generatedCards: [], error: null }),
}));
