import { useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useFlashcardStore } from "@/stores/flashcardStore";
import { useAIStore } from "@/stores/aiStore";
import { generateId } from "@/lib/utils";

// ===== Schema =====
const cardItemSchema = z.object({
  id: z.string(),
  front: z.string().min(1, "Không được để trống"),
  back: z.string().min(1, "Không được để trống"),
});

const createSetFormSchema = z.object({
  name: z.string().min(2, "Tên bộ thẻ ít nhất 2 ký tự"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  cards: z.array(cardItemSchema).min(2, "Cần ít nhất 2 thẻ"),
});

export type CreateSetFormValues = z.infer<typeof createSetFormSchema>;

// ===== Hook =====
export function useCreateSet() {
  const navigate = useNavigate();
  const { createSet } = useFlashcardStore();
  const { generatedCards, isGenerating, clearGenerated } = useAIStore();

  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");

  const form = useForm<CreateSetFormValues>({
    resolver: zodResolver(createSetFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: true,
      cards: [
        { id: generateId(), front: "", back: "" },
        { id: generateId(), front: "", back: "" },
        { id: generateId(), front: "", back: "" },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  // When AI generates cards, add them to the form
  const acceptAICards = useCallback(() => {
    if (generatedCards.length === 0) return;
    const newCards = generatedCards.map((c) => ({ id: generateId(), ...c }));
    replace(newCards);
    clearGenerated();
    setActiveTab("manual");
  }, [generatedCards, replace, clearGenerated]);

  const addCard = () => append({ id: generateId(), front: "", back: "" });

  const removeCard = (index: number) => {
    if (fields.length > 2) remove(index);
  };

  const onSubmit = async (data: CreateSetFormValues) => {
    const newSet = await createSet({
      name: data.name,
      description: data.description,
      isPublic: data.isPublic,
      cards: data.cards.map(({ front, back }) => ({ front, back })),
    });
    if (newSet) {
      navigate(`/sets/${newSet._id}`);
    }
  };

  return {
    form,
    fields,
    addCard,
    removeCard,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,

    // AI tab
    activeTab,
    setActiveTab,
    generatedCards,
    isGenerating,
    acceptAICards,
  };
}
