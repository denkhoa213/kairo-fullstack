import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { ChevronLeft, RotateCcw, HelpCircle } from "lucide-react";
import useStudyStore from "../../stores/studyStore";
import { MOCK_SETS, MOCK_FLASHCARDS } from "../../data/mockData";
import { cn, isSimilarAnswer, normalizeAnswer } from "../../lib/utils";

export default function WriteModePage() {
  const { id } = useParams<{ id: string }>();
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setId,
    setName,
    cards,
    currentIndex,
    isComplete,
    startSession,
    nextCard,
    recordAnswer,
    correct,
    incorrect,
    restart,
  } = useStudyStore();

  useEffect(() => {
    if (setId !== id) {
      const set = MOCK_SETS.find((s) => s._id === id);
      const setCards = MOCK_FLASHCARDS.filter((c) => c.setId === id);
      if (set && setCards.length > 0) {
        startSession(set._id, set.name, setCards, "write");
      }
    }
  }, [id, setId, startSession]);

  useEffect(() => {
    if (!isComplete && !showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isComplete, showResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || showResult) return;

    const currentCard = cards[currentIndex];
    // Check if the user's answer is correct or similar
    const correctAns = isSimilarAnswer(input, currentCard.front);

    setIsCorrect(correctAns);
    setShowResult(true);
    recordAnswer(correctAns);
  };

  const handleNext = () => {
    setInput("");
    setShowResult(false);
    setIsCorrect(null);
    setShowHint(false);
    nextCard();
  };

  const generateHintText = (text: string) => {
    return text
      .split("")
      .map((char, i) => {
        if (char === " ") return " ";
        // Show first letter and roughly 30% of other letters
        if (i === 0 || Math.random() > 0.7) return char;
        return "_";
      })
      .join("");
  };

  if (!cards.length) return null;
  const progress = (currentIndex / cards.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-16 flex items-center px-4 border-b border-border bg-card">
          <Link
            to={`/sets/${setId}`}
            className="p-2 -ml-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="ml-2">
            <h1 className="text-sm font-semibold text-foreground">{setName}</h1>
            <p className="text-xs text-muted-foreground">Write Mode</p>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center shadow-card animate-scale-in">
            <div className="text-6xl mb-6">✍️</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Hoàn thành bài tập!
            </h2>
            <p className="text-muted-foreground mb-8">
              Kết quả luyện viết của bạn.
            </p>

            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{correct}</p>
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Đúng
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {incorrect}
                </p>
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Sai
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={restart}
                className="w-full py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold flex items-center justify-center gap-2 shadow-primary hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" /> Học lại
              </button>
              <Link
                to={`/sets/${setId}`}
                className="w-full py-3.5 rounded-2xl border border-border text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-accent transition-colors"
              >
                Trở về bộ thẻ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const exactMatch =
    isCorrect && normalizeAnswer(input) === normalizeAnswer(currentCard.front);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 flex items-center px-4 lg:px-8 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Link
            to={`/sets/${setId}`}
            className="p-2 -ml-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
              {setName}
            </h1>
            <p className="text-xs text-muted-foreground">Write Mode</p>
          </div>
        </div>
        <div className="ml-auto text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </div>
      </header>

      <div className="h-1 bg-muted shrink-0 w-full">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center p-4 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-2xl mt-8">
          {/* Question card */}
          <div className="bg-card border border-border rounded-3xl p-8 mb-6 shadow-sm">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
              Nghĩa / Định nghĩa
            </span>
            <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
              {currentCard.back}
            </p>
            {currentCard.backImage && (
              <img
                src={currentCard.backImage}
                alt="Visual"
                className="mt-4 max-h-40 rounded-xl"
              />
            )}
          </div>

          {/* Form / Result area */}
          {!showResult ? (
            <form onSubmit={handleSubmit} className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {!showHint && (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    title="Xem gợi ý"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setInput("");
                    setIsCorrect(false);
                    setShowResult(true);
                    recordAnswer(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Không biết
                </button>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập thuật ngữ / câu trả lời..."
                className="w-full pl-6 pr-40 py-5 rounded-2xl border-2 border-border bg-card focus:bg-background focus:border-primary outline-none transition-all duration-200 text-lg shadow-sm"
              />

              {showHint && (
                <div className="mt-3 px-4 py-2 rounded-xl bg-accent text-sm font-mono tracking-widest text-muted-foreground">
                  Gợi ý: {generateHintText(currentCard.front)}
                </div>
              )}
            </form>
          ) : (
            <div
              className={cn(
                "rounded-3xl p-8 shadow-sm animate-slide-in-up",
                isCorrect
                  ? "bg-success/10 border border-success/30"
                  : "bg-destructive/10 border border-destructive/30",
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                    isCorrect
                      ? "bg-success text-white"
                      : "bg-destructive text-white",
                  )}
                >
                  {isCorrect ? "✓" : "✗"}
                </div>
                <div className="flex-1">
                  <h3
                    className={cn(
                      "text-xl font-bold mb-4",
                      isCorrect ? "text-success" : "text-destructive",
                    )}
                  >
                    {isCorrect
                      ? exactMatch
                        ? "Chính xác!"
                        : "Khá tốt!"
                      : "Sai rồi"}
                  </h3>

                  {/* User answer vs Correct Answer */}
                  <div className="space-y-4">
                    {!isCorrect && input && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Bạn đã nhập
                        </p>
                        <p className="text-lg text-destructive line-through decoration-destructive/50">
                          {input}
                        </p>
                      </div>
                    )}

                    {(!isCorrect || !exactMatch) && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                          Đáp án đúng
                        </p>
                        <p className="text-xl font-bold text-foreground">
                          {currentCard.front}
                        </p>
                      </div>
                    )}

                    {isCorrect && exactMatch && (
                      <p className="text-xl font-bold text-foreground">
                        {input}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    className={cn(
                      "mt-8 px-8 py-3.5 rounded-xl font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95",
                      isCorrect ? "bg-success" : "bg-destructive",
                    )}
                    autoFocus
                  >
                    Tiếp tục (Enter)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
