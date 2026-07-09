import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2, Loader2, CheckCircle, RotateCcw, ChevronDown } from "lucide-react";
import { useAIStore } from "@/stores/aiStore";
import { aiGenerateSchema, type AIGenerateFormData } from "../schema/set.schema";
import { cn } from "@/lib/utils";

interface AIGeneratorProps {
  onAccept: () => void;
}

const LANGUAGE_OPTIONS = [
  { value: "vi", label: "🇻🇳 Tiếng Việt" },
  { value: "en", label: "🇬🇧 English" },
  { value: "ja", label: "🇯🇵 日本語" },
  { value: "ko", label: "🇰🇷 한국어" },
];

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Cơ bản" },
  { value: "intermediate", label: "Trung cấp" },
  { value: "advanced", label: "Nâng cao" },
];

const QUICK_TOPICS = [
  "IELTS Vocabulary", "TOEIC 900", "Tiếng Nhật N3", "ReactJS", "Python Basics",
  "Giải tích", "Kinh tế vi mô", "Marketing Digital",
];

export default function AIGenerator({ onAccept }: AIGeneratorProps) {
  const { generate, isGenerating, generatedCards, clearGenerated, error } = useAIStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AIGenerateFormData>({
    resolver: zodResolver(aiGenerateSchema),
    defaultValues: { language: "vi", count: 20, level: "intermediate" },
  });

  const onSubmit = async (data: AIGenerateFormData) => {
    await generate({
      topic: data.topic,
      language: data.language,
      count: data.count,
      level: data.level,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-violet-500/10 to-pink-500/10 border border-primary/20">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary shrink-0">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Tạo thẻ bằng AI</h3>
          <p className="text-sm text-muted-foreground">
            Nhập chủ đề, AI sẽ tự động tạo {watch("count") || 20} thẻ học cho bạn
          </p>
        </div>
      </div>

      {generatedCards.length === 0 ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Topic input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Chủ đề *</label>
            <input
              {...register("topic")}
              placeholder="Ví dụ: IELTS Vocabulary, ReactJS Hooks, Từ vựng Tiếng Nhật N3..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none transition-colors text-sm"
            />
            {errors.topic && (
              <p className="text-xs text-destructive">{errors.topic.message}</p>
            )}
          </div>

          {/* Quick topic suggestions */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Gợi ý nhanh:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setValue("topic", t)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    watch("topic") === t
                      ? "bg-primary text-white border-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Options row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ngôn ngữ</label>
              <div className="relative">
                <select
                  {...register("language")}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:border-primary outline-none text-sm appearance-none pr-8"
                >
                  {LANGUAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Số thẻ</label>
              <input
                type="number"
                {...register("count", { valueAsNumber: true })}
                min={5}
                max={50}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:border-primary outline-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Trình độ</label>
              <div className="relative">
                <select
                  {...register("level")}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:border-primary outline-none text-sm appearance-none pr-8"
                >
                  {LEVEL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-primary text-white font-bold flex items-center justify-center gap-2 shadow-primary hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI đang tạo thẻ...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Tạo {watch("count") || 20} thẻ bằng AI
              </>
            )}
          </button>
        </form>
      ) : (
        /* Preview generated cards */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <p className="font-semibold text-foreground">
                Đã tạo <span className="text-primary">{generatedCards.length}</span> thẻ
              </p>
            </div>
            <button
              onClick={clearGenerated}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Tạo lại
            </button>
          </div>

          {/* Preview scrollable list */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {generatedCards.map((card, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-2 bg-card border border-border rounded-xl px-4 py-3 text-sm"
              >
                <div>
                  <span className="text-xs text-muted-foreground font-semibold">Mặt trước</span>
                  <p className="text-foreground font-medium mt-0.5">{card.front}</p>
                </div>
                <div className="border-l border-border pl-2">
                  <span className="text-xs text-muted-foreground font-semibold">Mặt sau</span>
                  <p className="text-foreground mt-0.5">{card.back}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onAccept}
            className="w-full py-3.5 rounded-2xl bg-gradient-primary text-white font-bold flex items-center justify-center gap-2 shadow-primary hover:opacity-90 transition-opacity"
          >
            <CheckCircle className="w-5 h-5" />
            Dùng {generatedCards.length} thẻ này
          </button>
        </div>
      )}
    </div>
  );
}
