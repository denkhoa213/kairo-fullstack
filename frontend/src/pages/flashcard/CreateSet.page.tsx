import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Wand2,
} from "lucide-react";
import Layout from "../../components/layout/Layout";

interface EditingCard {
  id: string;
  front: string;
  back: string;
}

export default function CreateSetPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState<EditingCard[]>([
    { id: "1", front: "", back: "" },
    { id: "2", front: "", back: "" },
    { id: "3", front: "", back: "" },
  ]);

  const addCard = () => {
    setCards([...cards, { id: Math.random().toString(), front: "", back: "" }]);
  };

  const removeCard = (id: string) => {
    if (cards.length > 2) {
      setCards(cards.filter((c) => c.id !== id));
    }
  };

  const updateCard = (id: string, field: "front" | "back", value: string) => {
    setCards(cards.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề bộ thẻ");
      return;
    }
    // Logic to save goes here
    navigate("/sets");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">
              Tạo bộ thẻ mới
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold flex items-center gap-2 shadow-primary hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            Lưu bộ thẻ
          </button>
        </div>

        {/* Set details */}
        <div className="bg-card border border-border rounded-3xl p-6 mb-8 shadow-sm">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề (vd: Từ vựng IELTS)"
            className="w-full bg-transparent text-2xl font-bold text-foreground placeholder:text-muted-foreground/50 border-none outline-none mb-4"
          />
          <div className="h-px w-full bg-border mb-4" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Thêm mô tả (không bắt buộc)..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 border-none outline-none resize-none h-20"
          />

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <button className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors">
              <Wand2 className="w-4 h-4" /> Tạo bằng AI
            </button>
          </div>
        </div>

        {/* Cards list */}
        <div className="space-y-4 mb-8">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-card border border-border rounded-2xl overflow-hidden group shadow-sm transition-all hover:border-primary/30"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/30">
                <span className="text-sm font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <button
                  onClick={() => removeCard(card.id)}
                  disabled={cards.length <= 2}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 relative group/input">
                  <input
                    type="text"
                    value={card.front}
                    onChange={(e) =>
                      updateCard(card.id, "front", e.target.value)
                    }
                    className="w-full bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 text-foreground transition-colors"
                  />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Thuật ngữ
                  </span>
                </div>

                <div className="flex flex-col gap-2 relative">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={card.back}
                      onChange={(e) =>
                        updateCard(card.id, "back", e.target.value)
                      }
                      className="flex-1 bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 text-foreground transition-colors"
                    />
                    <button className="p-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Định nghĩa
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add button */}
        <button
          onClick={addCard}
          className="w-full py-6 rounded-3xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all flex flex-col items-center justify-center gap-2 font-medium"
        >
          <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center border border-border">
            <Plus className="w-5 h-5" />
          </div>
          Thêm thẻ mới
        </button>
      </div>
    </Layout>
  );
}
