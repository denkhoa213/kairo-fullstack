import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export function useSetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentSet,
    currentCards,
    isLoadingDetail,
    fetchSetDetail,
    deleteSet,
    toggleLike,
    clearCurrentSet,
  } = useFlashcardStore();

  useEffect(() => {
    if (id) {
      fetchSetDetail(id);
    }
    return () => clearCurrentSet();
  }, [id, fetchSetDetail, clearCurrentSet]);

  const isOwner = user && currentSet && user._id === currentSet.userId;

  const handleDelete = async () => {
    if (!currentSet) return;
    if (!confirm("Bạn có chắc chắn muốn xoá bộ thẻ này không?")) return;
    await deleteSet(currentSet._id);
    navigate("/sets");
  };

  const handleLike = () => {
    if (!currentSet) return;
    if (!user) {
      toast.error("Vui lòng đăng nhập để thích bộ thẻ");
      return;
    }
    toggleLike(currentSet._id);
  };

  const studyModes = [
    { id: "flashcard", label: "Flashcard", emoji: "🃏", path: `/study/${id}/flashcard` },
    { id: "learn", label: "Học", emoji: "🧠", path: `/study/${id}/learn` },
    { id: "write", label: "Gõ", emoji: "✍️", path: `/study/${id}/write` },
    { id: "test", label: "Kiểm tra", emoji: "📝", path: `/study/${id}/test` },
    { id: "match", label: "Ghép thẻ", emoji: "🎯", path: `/study/${id}/match` },
    { id: "speed", label: "Tốc độ", emoji: "⚡", path: `/study/${id}/speed` },
  ];

  return {
    id,
    set: currentSet,
    cards: currentCards,
    isLoading: isLoadingDetail,
    isOwner,
    studyModes,
    handleDelete,
    handleLike,
  };
}
