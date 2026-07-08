import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  Check,
  X,
  RotateCcw,
  Maximize,
  Play,
  Shuffle,
  Settings,
  ChevronLeft,
} from "lucide-react";
import useStudyStore from "../../stores/studyStore";
import { MOCK_SETS, MOCK_FLASHCARDS } from "../../data/mockData";
import { cn } from "../../lib/utils";
import FlashCard from "../../components/ui/FlashCard";

export default function FlashcardModePage() {
  const { id } = useParams<{ id: string }>();
  const [showSettings, setShowSettings] = useState(false);

  const {
    setId,
    setName,
    cards,
    currentIndex,
    isFlipped,
    known,
    unknown,
    isComplete,
    isAutoPlay,
    isFullscreen,
    startSession,
    nextCard,
    prevCard,
    flipCard,
    markKnown,
    markUnknown,
    toggleAutoPlay,
    toggleShuffle,
    toggleFullscreen,
    restart,
  } = useStudyStore();

  // Load data
  useEffect(() => {
    if (setId !== id) {
      const set = MOCK_SETS.find((s) => s._id === id);
      const setCards = MOCK_FLASHCARDS.filter((c) => c.setId === id);

      if (set && setCards.length > 0) {
        startSession(set._id, set.name, setCards, "flashcard");
      }
    }
  }, [id, setId, startSession]);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlay || isComplete) return;

    const timer = setInterval(() => {
      if (!isFlipped) {
        flipCard();
      } else {
        nextCard();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoPlay, isFlipped, isComplete, flipCard, nextCard]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === " " ||
        e.key === "Enter" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        flipCard();
      } else if (e.key === "ArrowRight") {
        if (isFlipped) markKnown();
        else nextCard();
      } else if (e.key === "ArrowLeft") {
        if (isFlipped) markUnknown();
        else prevCard();
      } else if (e.key === "1") {
        markUnknown();
      } else if (e.key === "2") {
        markKnown();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipCard, nextCard, prevCard, markKnown, markUnknown, isFlipped]);

  if (!cards.length) return null;

  const progress = ((currentIndex + (isComplete ? 1 : 0)) / cards.length) * 100;

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
            <p className="text-xs text-muted-foreground">Flashcard Mode</p>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center shadow-card animate-scale-in">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Tuyệt vời!
            </h2>
            <p className="text-muted-foreground mb-8">
              Bạn đã hoàn thành bộ thẻ.
            </p>

            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {known.length}
                </p>
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Đã thuộc
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">
                  {unknown.length}
                </p>
                <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                  Cần ôn lại
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={restart}
                className="w-full py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold flex items-center justify-center gap-2 shadow-primary hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" />
                Học lại từ đầu
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

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-background transition-colors duration-300",
        isFullscreen && "fixed inset-0 z-50 bg-background",
      )}
    >
      {/* ── Header ── */}
      <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          {!isFullscreen && (
            <Link
              to={`/sets/${setId}`}
              className="p-2 -ml-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
              {setName}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              {currentIndex + 1} / {cards.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleAutoPlay}
            className={cn(
              "p-2 rounded-xl transition-colors",
              isAutoPlay
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
            title="Tự động lật (3s)"
          >
            <Play className="w-5 h-5" />
          </button>
          <button
            onClick={toggleShuffle}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Trộn thẻ"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors hidden sm:block"
          >
            <Maximize className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="h-1 bg-muted shrink-0 w-full">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-hidden relative">
        <div className="w-full max-w-2xl h-full max-h-[600px] flex flex-col">
          {/* Card */}
          <div className="flex-1 relative mb-8 perspective-1000">
            {cards.map((card, i) => {
              if (Math.abs(currentIndex - i) > 1) return null; // Only render current, prev, next

              const isCurrent = i === currentIndex;

              return (
                <div
                  key={card._id}
                  className={cn(
                    "absolute inset-0 transition-all duration-500",
                    isCurrent
                      ? "z-10 opacity-100 translate-x-0"
                      : i < currentIndex
                        ? "-translate-x-full opacity-0 pointer-events-none"
                        : "translate-x-full opacity-0 pointer-events-none",
                  )}
                >
                  <FlashCard
                    card={card}
                    isFlipped={isCurrent ? isFlipped : false}
                    onFlip={isCurrent ? flipCard : undefined}
                    size="lg"
                    showHint={true}
                  />
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="shrink-0 flex items-center justify-between gap-4">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="p-4 rounded-2xl bg-card border border-border text-foreground hover:bg-accent disabled:opacity-30 disabled:hover:bg-card transition-colors shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex-1 flex items-center gap-3">
              <button
                onClick={markUnknown}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 border",
                  isFlipped
                    ? "bg-warning/10 border-warning text-warning hover:bg-warning/20 shadow-sm"
                    : "bg-card border-border text-muted-foreground opacity-50 cursor-not-allowed",
                )}
                disabled={!isFlipped}
              >
                <X className="w-5 h-5" />
                Cần học lại{" "}
                <span className="hidden sm:inline text-xs font-normal opacity-70 ml-1">
                  (Phím 1)
                </span>
              </button>

              <button
                onClick={markKnown}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 border",
                  isFlipped
                    ? "bg-success/10 border-success text-success hover:bg-success/20 shadow-sm"
                    : "bg-card border-border text-muted-foreground opacity-50 cursor-not-allowed",
                )}
                disabled={!isFlipped}
              >
                <Check className="w-5 h-5" />
                Đã thuộc{" "}
                <span className="hidden sm:inline text-xs font-normal opacity-70 ml-1">
                  (Phím 2)
                </span>
              </button>
            </div>

            <button
              onClick={nextCard}
              disabled={currentIndex === cards.length - 1 && !isFlipped}
              className="p-4 rounded-2xl bg-card border border-border text-foreground hover:bg-accent disabled:opacity-30 disabled:hover:bg-card transition-colors shadow-sm rotate-180"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="absolute bottom-6 hidden lg:flex items-center gap-6 text-xs text-muted-foreground font-medium">
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-muted border border-border">
              Space
            </kbd>{" "}
            Lật thẻ
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 rounded bg-muted border border-border">
              ←
            </kbd>{" "}
            /{" "}
            <kbd className="px-2 py-1 rounded bg-muted border border-border">
              →
            </kbd>{" "}
            Chuyển thẻ
          </span>
        </div>
      </main>
    </div>
  );
}
