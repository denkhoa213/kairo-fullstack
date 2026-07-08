import { useState, useCallback } from "react";
import { RotateCcw, Volume2 } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Flashcard } from "../../types";

interface FlashCardProps {
  card: Flashcard;
  isFlipped?: boolean;
  onFlip?: () => void;
  className?: string;
  showHint?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FlashCard({
  card,
  isFlipped = false,
  onFlip,
  className,
  showHint = false,
  size = "md",
}: FlashCardProps) {
  const [isLocalFlipped, setIsLocalFlipped] = useState(false);

  const flipped = onFlip ? isFlipped : isLocalFlipped;

  const handleFlip = useCallback(() => {
    if (onFlip) {
      onFlip();
    } else {
      setIsLocalFlipped((prev) => !prev);
    }
  }, [onFlip]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleFlip();
    }
  };

  const sizeClasses = {
    sm: "min-h-[160px]",
    md: "min-h-[260px]",
    lg: "min-h-[360px]",
  };

  return (
    <div
      className={cn("flashcard-scene w-full", sizeClasses[size], className)}
      style={{ perspective: "1000px" }}
    >
      <div
        className={cn(
          "flashcard-inner w-full h-full",
          flipped && "is-flipped"
        )}
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={flipped ? "Mặt sau thẻ - click để lật" : "Mặt trước thẻ - click để lật"}
      >
        {/* Front */}
        <div className="flashcard-front bg-card border border-border shadow-card select-none">
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 relative">
            {/* Label */}
            <span className="absolute top-4 left-4 text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-0.5 bg-muted rounded-md">
              Từ / Câu hỏi
            </span>

            {/* Content */}
            <div className="flex flex-col items-center gap-3 px-6 w-full">
              {card.frontImage && (
                <img
                  src={card.frontImage}
                  alt="Front"
                  className="max-h-28 object-contain rounded-xl"
                />
              )}
              <p className="text-2xl font-bold text-foreground text-center leading-snug">
                {card.front}
              </p>
              {showHint && card.hint && (
                <p className="text-sm text-muted-foreground italic">💡 {card.hint}</p>
              )}
            </div>

            {/* Audio button */}
            {card.frontAudio && (
              <button
                onClick={(e) => { e.stopPropagation(); /* play audio */ }}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-accent transition-colors duration-200"
              >
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* Flip hint */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-muted-foreground/60">
              <RotateCcw className="w-3 h-3" />
              <span>Click để lật</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="flashcard-back bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 shadow-card select-none">
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 relative">
            {/* Label */}
            <span className="absolute top-4 left-4 text-xs font-medium text-primary/70 uppercase tracking-wide px-2 py-0.5 bg-primary/10 rounded-md">
              Nghĩa / Đáp án
            </span>

            {/* Content */}
            <div className="flex flex-col items-center gap-3 px-6 w-full">
              {card.backImage && (
                <img
                  src={card.backImage}
                  alt="Back"
                  className="max-h-28 object-contain rounded-xl"
                />
              )}
              <p className="text-2xl font-bold text-foreground text-center leading-snug">
                {card.back}
              </p>
              {card.example && (
                <div className="w-full mt-2 px-4 py-2.5 bg-primary/8 rounded-xl border border-primary/15">
                  <p className="text-xs font-medium text-primary mb-1">Ví dụ:</p>
                  <p className="text-sm text-muted-foreground italic">{card.example}</p>
                </div>
              )}
            </div>

            {/* Audio button */}
            {card.backAudio && (
              <button
                onClick={(e) => { e.stopPropagation(); }}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-accent transition-colors duration-200"
              >
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* Flip hint */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-muted-foreground/60">
              <RotateCcw className="w-3 h-3" />
              <span>Click để lật lại</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
