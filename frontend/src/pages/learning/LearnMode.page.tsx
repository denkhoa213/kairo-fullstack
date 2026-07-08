import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ChevronLeft, Check, X, RotateCcw } from "lucide-react";
import useStudyStore from "../../stores/studyStore";
import { MOCK_SETS, MOCK_FLASHCARDS } from "../../data/mockData";
import { cn, shuffle } from "../../lib/utils";

export default function LearnModePage() {
  const { id } = useParams<{ id: string }>();
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

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
        startSession(set._id, set.name, setCards, "learn");
      }
    }
  }, [id, setId, startSession]);

  // Generate options
  useEffect(() => {
    if (isComplete || cards.length === 0) return;

    const currentCard = cards[currentIndex];
    const wrongOptions = cards
      .filter((c) => c._id !== currentCard._id)
      .map((c) => c.back)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = shuffle([currentCard.back, ...wrongOptions]);
    setOptions(allOptions);
    setSelected(null);
    setShowResult(false);
  }, [currentIndex, cards, isComplete]);

  const handleSelect = (option: string) => {
    if (showResult) return;
    setSelected(option);
    setShowResult(true);

    const isCorrect = option === cards[currentIndex].back;
    recordAnswer(isCorrect);

    setTimeout(() => {
      nextCard();
    }, 1500);
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
            <p className="text-xs text-muted-foreground">Learn Mode</p>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center shadow-card animate-scale-in">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Hoàn thành bài học!</h2>
            <p className="text-muted-foreground mb-8">
              Kết quả trắc nghiệm của bạn.
            </p>

            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{correct}</p>
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Đúng
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{incorrect}</p>
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
                <RotateCcw className="w-4 h-4" />
                Học lại
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
            <p className="text-xs text-muted-foreground">Learn Mode</p>
          </div>
        </div>
        <div className="ml-auto text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </div>
      </header>

      {/* Progress */}
      <div className="h-1 bg-muted shrink-0 w-full">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-3xl">
          {/* Question */}
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 mb-8 shadow-sm text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
              Thuật ngữ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {currentCard.front}
            </h2>
            {currentCard.frontImage && (
              <img
                src={currentCard.frontImage}
                alt="Question visual"
                className="mt-6 max-h-40 object-contain mx-auto rounded-xl"
              />
            )}
          </div>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-4">
            {options.map((option, i) => {
              const isCorrectOption = option === currentCard.back;
              const isSelected = selected === option;

              let btnClass = "bg-card border-border hover:border-primary/50 hover:bg-accent text-foreground";
              let icon = null;

              if (showResult) {
                if (isCorrectOption) {
                  btnClass = "bg-success/10 border-success text-success answer-correct";
                  icon = <Check className="w-5 h-5" />;
                } else if (isSelected) {
                  btnClass = "bg-destructive/10 border-destructive text-destructive answer-wrong";
                  icon = <X className="w-5 h-5" />;
                } else {
                  btnClass = "bg-card border-border opacity-50";
                }
              } else if (isSelected) {
                btnClass = "border-primary ring-2 ring-primary/20 bg-accent";
              }

              return (
                <button
                  key={i}
                  disabled={showResult}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "relative p-6 rounded-2xl border text-left font-medium transition-all duration-200 shadow-sm flex items-center justify-between group",
                    btnClass
                  )}
                >
                  <span className="pr-8">{option}</span>
                  {icon && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2">
                      {icon}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
