import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { ChevronLeft, RotateCcw, Trophy, Timer } from "lucide-react";
import useStudyStore from "../../stores/studyStore";
import { MOCK_SETS, MOCK_FLASHCARDS } from "../../data/mockData";
import { cn, shuffle } from "../../lib/utils";
import type { MatchItem } from "../../types";

export default function MatchGamePage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MatchItem[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongMatch, setWrongMatch] = useState<string[]>([]); // IDs of items currently shaking

  const {
    setId,
    setName,
    cards,
    startSession,
  } = useStudyStore();

  useEffect(() => {
    if (setId !== id) {
      const set = MOCK_SETS.find((s) => s._id === id);
      const setCards = MOCK_FLASHCARDS.filter((c) => c.setId === id);
      if (set && setCards.length > 0) {
        startSession(set._id, set.name, setCards, "match");
      }
    }
  }, [id, setId, startSession]);

  // Initialize game
  const initGame = useCallback(() => {
    if (cards.length === 0) return;

    // Pick 6 random cards
    const selectedCards = shuffle([...cards]).slice(0, 6);
    
    const gameItems: MatchItem[] = [];
    selectedCards.forEach(card => {
      gameItems.push({
        id: `t_${card._id}`,
        content: card.front,
        type: "term",
        flashcardId: card._id,
        isMatched: false,
        isSelected: false,
      });
      gameItems.push({
        id: `d_${card._id}`,
        content: card.back,
        type: "definition",
        flashcardId: card._id,
        isMatched: false,
        isSelected: false,
      });
    });

    setItems(shuffle(gameItems));
    setSelectedItems([]);
    setMatchedCount(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsFinished(false);
    setWrongMatch([]);
  }, [cards]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer
  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  const handleItemClick = (item: MatchItem) => {
    if (item.isMatched || isFinished || wrongMatch.length > 0) return;

    // Deselect if already selected
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
      setItems(items.map(i => i.id === item.id ? { ...i, isSelected: false } : i));
      return;
    }

    const newSelected = [...selectedItems, item];
    setSelectedItems(newSelected);
    setItems(items.map(i => i.id === item.id ? { ...i, isSelected: true } : i));

    // Check match when 2 items are selected
    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      
      if (first.flashcardId === second.flashcardId && first.type !== second.type) {
        // Correct match
        setTimeout(() => {
          setItems(prev => prev.map(i => 
            i.id === first.id || i.id === second.id 
              ? { ...i, isMatched: true, isSelected: false } 
              : i
          ));
          setSelectedItems([]);
          
          const newMatchedCount = matchedCount + 1;
          setMatchedCount(newMatchedCount);
          
          // Check win condition (6 pairs)
          if (newMatchedCount === items.length / 2) {
            setIsFinished(true);
          }
        }, 300);
      } else {
        // Wrong match
        setWrongMatch([first.id, second.id]);
        setTimeout(() => {
          setItems(prev => prev.map(i => 
            i.id === first.id || i.id === second.id 
              ? { ...i, isSelected: false } 
              : i
          ));
          setSelectedItems([]);
          setWrongMatch([]);
        }, 800);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!cards.length) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border bg-card shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Link to={`/sets/${setId}`} className="p-2 -ml-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-foreground truncate">{setName}</h1>
            <p className="text-xs text-muted-foreground">Match Game</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-accent px-3 py-1.5 rounded-lg text-sm font-medium">
            <Timer className="w-4 h-4 text-primary" />
            <span className={cn("w-12 text-right tabular-nums", isFinished && "text-primary")}>
              {formatTime(elapsedTime)}
            </span>
          </div>
          <button 
            onClick={initGame}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Chơi lại"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8 flex flex-col items-center">
        {isFinished ? (
          <div className="w-full max-w-md mt-12 bg-card border border-border rounded-3xl p-8 text-center shadow-card animate-scale-in relative overflow-hidden">
            {/* Confetti effect placeholder */}
            <div className="absolute inset-0 pointer-events-none opacity-50 flex items-center justify-center">
              <span className="text-6xl animate-ping-once absolute top-10 left-10">✨</span>
              <span className="text-5xl animate-ping-once absolute top-20 right-12" style={{animationDelay: "0.2s"}}>🌟</span>
              <span className="text-7xl animate-ping-once absolute bottom-16 left-20" style={{animationDelay: "0.4s"}}>💫</span>
            </div>

            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-2">Hoàn thành!</h2>
            <p className="text-muted-foreground mb-8">Bạn đã ghép xong tất cả các thẻ.</p>
            
            <div className="bg-accent/50 rounded-2xl p-6 mb-8">
              <p className="text-sm font-medium text-muted-foreground mb-1">Thời gian của bạn</p>
              <p className="text-5xl font-bold gradient-text">{formatTime(elapsedTime)}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={initGame}
                className="w-full py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold shadow-primary hover:opacity-90 transition-opacity"
              >
                Chơi lại
              </button>
              <Link 
                to={`/sets/${setId}`}
                className="w-full py-3.5 rounded-2xl border border-border text-foreground font-semibold hover:bg-accent transition-colors"
              >
                Trở về bộ thẻ
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.isMatched}
                  className={cn(
                    "match-card min-h-[120px] flex items-center justify-center text-center p-4 rounded-2xl border-2 transition-all duration-200 select-none shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    item.isMatched ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100",
                    item.isSelected && !wrongMatch.includes(item.id) ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20 scale-105" : "border-border bg-card hover:border-primary/50",
                    wrongMatch.includes(item.id) ? "border-destructive bg-destructive/10 text-destructive animate-wrong-shake" : "text-foreground"
                  )}
                >
                  <span className={cn(
                    "font-medium",
                    item.type === "term" ? "text-lg md:text-xl font-bold" : "text-sm md:text-base leading-relaxed"
                  )}>
                    {item.content}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
