import { ChevronLeft, Plus, Trash2, ImageIcon, Save, Wand2, Loader2 } from "lucide-react";
import { Link } from "react-router";
import Layout from "../../components/layout/Layout";
import AIGenerator from "./components/AIGenerator";
import { useCreateSet } from "@/hooks/flashcard/useCreateSet";
import { cn } from "@/lib/utils";

export default function CreateSetPage() {
  const {
    form,
    fields,
    addCard,
    removeCard,
    onSubmit,
    isSubmitting,
    activeTab,
    setActiveTab,
    generatedCards,
    acceptAICards,
  } = useCreateSet();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              to="/sets"
              className="p-2 rounded-xl hover:bg-accent transition-colors text-muted-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tạo bộ thẻ mới</h1>
              <p className="text-sm text-muted-foreground">{fields.length} thẻ</p>
            </div>
          </div>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold flex items-center gap-2 shadow-primary hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lưu bộ thẻ
          </button>
        </div>

        {/* Set metadata */}
        <div className="bg-card border border-border rounded-3xl p-6 mb-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                {...register("name")}
                placeholder="Nhập tiêu đề bộ thẻ..."
                className="w-full bg-transparent text-2xl font-bold text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="h-px bg-border" />

            <textarea
              {...register("description")}
              placeholder="Mô tả bộ thẻ (không bắt buộc)..."
              rows={2}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none"
            />

            <div className="flex items-center gap-4 pt-2 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isPublic")}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-medium text-foreground">Công khai</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1.5 bg-muted rounded-2xl mb-6 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
              activeTab === "manual"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            ✏️ Nhập thủ công
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
              activeTab === "ai"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Wand2 className="w-4 h-4" />
            Tạo bằng AI
            {generatedCards.length > 0 && (
              <span className="px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                {generatedCards.length}
              </span>
            )}
          </button>
        </div>

        {/* AI Generator Panel */}
        {activeTab === "ai" && (
          <div className="bg-card border border-border rounded-3xl p-6 mb-6 shadow-sm">
            <AIGenerator onAccept={acceptAICards} />
          </div>
        )}

        {/* Manual Card Editor */}
        {activeTab === "manual" && (
          <>
            {errors.cards?.root && (
              <p className="text-sm text-destructive mb-3">{errors.cards.root.message}</p>
            )}

            <div className="space-y-4 mb-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 transition-colors"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-muted/30">
                    <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      disabled={fields.length <= 2}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card body */}
                  <div className="p-5 grid md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <input
                        {...register(`cards.${index}.front`)}
                        placeholder="Thuật ngữ"
                        className="w-full bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 text-foreground transition-colors text-sm"
                      />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Thuật ngữ
                      </span>
                      {errors.cards?.[index]?.front && (
                        <p className="text-xs text-destructive">
                          {errors.cards[index]?.front?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          {...register(`cards.${index}.back`)}
                          placeholder="Định nghĩa"
                          className="flex-1 bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 text-foreground transition-colors text-sm"
                        />
                        <button
                          type="button"
                          className="p-2 border-2 border-dashed border-border rounded-xl hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Định nghĩa
                      </span>
                      {errors.cards?.[index]?.back && (
                        <p className="text-xs text-destructive">
                          {errors.cards[index]?.back?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addCard}
              className="w-full py-5 rounded-3xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2 font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-card shadow-sm flex items-center justify-center border border-border">
                <Plus className="w-4 h-4" />
              </div>
              Thêm thẻ mới
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}
