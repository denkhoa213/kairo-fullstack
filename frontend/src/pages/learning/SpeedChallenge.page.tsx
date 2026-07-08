import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { ChevronLeft, RotateCcw, Zap, Target } from "lucide-react";
import useStudyStore from "../../stores/studyStore";
import { MOCK_SETS, MOCK_FLASHCARDS } from "../../data/mockData";
import { cn, shuffle } from "../../lib/utils";

export default function SpeedChallengePage() {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds default
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [floatingPoints, setFloatingPoints] = useState<{id: number, val: number}[]>([]);

  const {
    setId,
    setName,
    cards,
    currentIndex,
    startSession,
    nextCard,
  } = useStudyStore();

  useEffect(() => {
    if (setId !== id) {
      const set = MOCK_SETS.find((s) => s._id === id);
      const setCards = MOCK_FLASHCARDS.filter((c) => c.setId === id);
      if (set && setCards.length > 0) {
        // Start a randomized infinite pool of these cards
        startSession(set._id, set.name, shuffle([...setCards, ...setCards, ...setCards]), "speed");
      }
    }
  }, [id, setId, startSession]);

  // Generate options
  useEffect(() => {
    if (!isPlaying || isFinished || cards.length === 0) return;

    const currentCard = cards[currentIndex];
    const wrongOptions = MOCK_FLASHCARDS
      .filter((c) => c._id !== currentCard._id && c.setId === id)
      .map((c) => c.back)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // fallback if not enough wrong options in set
    if (wrongOptions.length < 3) {
        const extra = MOCK_FLASHCARDS.filter(c => c._id !== currentCard._id && !wrongOptions.includes(c.back)).map(c => c.back).slice(0, 3 - wrongOptions.length);
        wrongOptions.push(...extra);
    }

    setOptions(shuffle([currentCard.back, ...wrongOptions]));
    setSelected(null);
    setShowResult(false);
  }, [currentIndex, isPlaying, isFinished, cards, id]);

  // Timer
  useEffect(() => {
    if (!isPlaying || isFinished) return;

    if (timeLeft <= 0) {
      setIsFinished(true);
      setIsPlaying(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isFinished, timeLeft]);

  const addFloatingPoint = useCallback((val: number) => {
    const id = Date.now();
    setFloatingPoints(prev => [...prev, { id, val }]);
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== id));
    }, 1000);
  }, []);

  const handleSelect = (option: string) => {
    if (showResult || !isPlaying) return;
    
    setSelected(option);
    setShowResult(true);

    const isCorrect = option === cards[currentIndex].back;
    
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      
      // Calculate points with combo multiplier
      const points = 10 * Math.min(newCombo, 5); 
      setScore(prev => prev + points);
      addFloatingPoint(points);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      nextCard();
    }, isCorrect ? 400 : 800); // Faster transition for correct answers to keep speed up
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    startSession(id!, setName, shuffle([...cards]), "speed"); // shuffle again
  };

  if (!cards.length) return null;
  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Dynamic background effect based on combo */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
          combo >= 5 ? "bg-gradient-to-t from-orange-500/10 via-transparent opacity-100" : "opacity-0"
        )}
      />

      <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border bg-card shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <Link to={`/sets/${setId}`} className="p-2 -ml-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-foreground truncate">{setName}</h1>
            <p className="text-xs text-muted-foreground">Speed Challenge</p>
          </div>
        </div>
        
        {isPlaying && (
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Score</span>
              <span className="font-bold font-mono text-lg leading-none">{score}</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full font-bold tabular-nums transition-colors",
              timeLeft <= 10 ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-primary text-primary-foreground"
            )}>
              <Zap className="w-4 h-4" />
              {timeLeft}s
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 p-4 lg:p-8 flex flex-col items-center justify-center relative z-10">
        {!isPlaying && !isFinished && (
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center shadow-card animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20">
              <Zap className="w-10 h-10 text-white fill-white" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Speed Challenge</h2>
            <p className="text-muted-foreground mb-8 text-sm">
              Bạn có 60 giây. Trả lời càng nhanh, điểm càng cao. Trả lời đúng liên tiếp để tăng combo!
            </p>
            
            <button 
              onClick={startGame}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
            >
              BẮT ĐẦU (60s)
            </button>
          </div>
        )}

        {isFinished && (
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center shadow-card animate-scale-in">
            <Target className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-1">Hết giờ!</h2>
            <p className="text-muted-foreground mb-8">Điểm số của bạn</p>
            
            <div className="text-6xl font-black gradient-text mb-8">{score}</div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-accent rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Thẻ đã học</p>
                <p className="text-xl font-bold">{currentIndex}</p>
              </div>
              <div className="bg-accent rounded-2xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Max Combo</p>
                <p className="text-xl font-bold flex items-center justify-center gap-1">
                  {maxCombo} <span className="text-orange-500 text-sm">🔥</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={startGame}
                className="w-full py-3.5 rounded-2xl bg-gradient-primary text-white font-semibold flex items-center justify-center gap-2 shadow-primary hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" />
                Chơi lại
              </button>
              <Link 
                to={`/sets/${setId}`}
                className="w-full py-3.5 rounded-2xl border border-border text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-accent transition-colors"
              >
                Trở về bộ thẻ
              </Link>
            </div>
          </div>
        )}

        {isPlaying && (
          <div className="w-full max-w-3xl flex flex-col h-full relative">
            {/* Floating points animation */}
            {floatingPoints.map(pt => (
              <div 
                key={pt.id} 
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-4xl text-orange-500 pointer-events-none animate-float-up z-50 drop-shadow-md"
              >
                +{pt.val}
              </div>
            ))}

            {/* Combo meter */}
            {combo >= 3 && (
              <div className="absolute top-0 right-0 -translate-y-8 flex items-center gap-2 animate-bounce">
                <span className="text-2xl">🔥</span>
                <span className="font-black italic text-orange-500 text-xl">{combo}x COMBO!</span>
              </div>
            )}

            {/* Question */}
            <div className="flex-1 flex items-center justify-center min-h-[200px] bg-card border-2 border-border rounded-3xl p-8 md:p-12 mb-6 shadow-sm text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                {currentCard.front}
              </h2>
            </div>

            {/* Options */}
            <div className="grid sm:grid-cols-2 gap-4 shrink-0">
              {options.map((option, i) => {
                const isCorrectOption = option === currentCard.back;
                const isSelected = selected === option;

                let btnClass = "bg-card border-2 border-border hover:border-primary/50 text-foreground";

                if (showResult) {
                  if (isCorrectOption) {
                    btnClass = "bg-success border-success text-white scale-[1.02] shadow-lg shadow-success/20";
                  } else if (isSelected) {
                    btnClass = "bg-destructive border-destructive text-white scale-[0.98]";
                  } else {
                    btnClass = "bg-card border-border opacity-30";
                  }
                } else {
                  // hover effect when active
                  btnClass += " hover:-translate-y-1 hover:shadow-md active:scale-95";
                }

                return (
                  <button
                    key={i}
                    disabled={showResult}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "p-6 md:p-8 rounded-2xl text-center font-bold text-lg md:text-xl transition-all duration-200",
                      btnClass
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
