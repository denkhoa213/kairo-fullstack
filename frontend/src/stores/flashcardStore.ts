import { create } from "zustand";
import { toast } from "sonner";
import { flashcardSetService } from "@/services/flashcardSet.service";
import { flashcardService } from "@/services/flashcard.service";
import type { FlashcardState } from "@/types/store.type";

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  // Browse
  sets: [],
  totalSets: 0,
  currentPage: 1,
  isLoadingSets: false,

  // My sets
  mySets: [],
  isLoadingMySets: false,

  // Detail
  currentSet: null,
  currentCards: [],
  isLoadingDetail: false,

  fetchSets: async (params) => {
    set({ isLoadingSets: true });
    try {
      const data = await flashcardSetService.list(params);
      set({
        sets: data.items,
        totalSets: data.total,
        currentPage: data.page,
      });
    } catch (err) {
      console.error("fetchSets error:", err);
      toast.error("Không thể tải danh sách bộ thẻ");
    } finally {
      set({ isLoadingSets: false });
    }
  },

  fetchMySets: async () => {
    set({ isLoadingMySets: true });
    try {
      const data = await flashcardSetService.getMySets();
      set({ mySets: data });
    } catch (err) {
      console.error("fetchMySets error:", err);
      toast.error("Không thể tải bộ thẻ của bạn");
    } finally {
      set({ isLoadingMySets: false });
    }
  },

  fetchSetDetail: async (id: string) => {
    set({ isLoadingDetail: true });
    try {
      const data = await flashcardService.getSetWithCards(id);
      set({ currentSet: data.set, currentCards: data.flashcards });
    } catch (err) {
      console.error("fetchSetDetail error:", err);
      toast.error("Không thể tải bộ thẻ");
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  createSet: async (data) => {
    try {
      const newSet = await flashcardSetService.create(data);
      // Add to mySets immediately
      set((state) => ({ mySets: [newSet, ...state.mySets] }));
      toast.success("Tạo bộ thẻ thành công!");
      return newSet;
    } catch (err) {
      console.error("createSet error:", err);
      toast.error("Tạo bộ thẻ thất bại");
      return null;
    }
  },

  deleteSet: async (id: string) => {
    try {
      await flashcardSetService.delete(id);
      set((state) => ({
        sets: state.sets.filter((s) => s._id !== id),
        mySets: state.mySets.filter((s) => s._id !== id),
      }));
      toast.success("Đã xoá bộ thẻ");
    } catch {
      toast.error("Không thể xoá bộ thẻ");
    }
  },

  toggleLike: async (id: string) => {
    const currentSets = get().sets;
    const set_ = currentSets.find((s) => s._id === id);
    if (!set_) return;
    try {
      const result = await flashcardSetService.toggleLike(id, !!set_.isLiked);
      set((state) => ({
        sets: state.sets.map((s) =>
          s._id === id
            ? { ...s, isLiked: !s.isLiked, favoriteCount: result.favoriteCount }
            : s
        ),
        currentSet:
          state.currentSet?._id === id
            ? { ...state.currentSet, isLiked: !state.currentSet.isLiked, favoriteCount: result.favoriteCount }
            : state.currentSet,
      }));
    } catch {
      toast.error("Không thể thực hiện thao tác");
    }
  },

  clearCurrentSet: () => set({ currentSet: null, currentCards: [] }),
}));
