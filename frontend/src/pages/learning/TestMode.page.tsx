import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ChevronLeft, RotateCcw, Award } from "lucide-react";
import useStudyStore from "../../stores/studyStore";
import { MOCK_SETS, MOCK_FLASHCARDS } from "../../data/mockData";
import { cn, shuffle } from "../../lib/utils";
import type { TestQuestion, TestResult } from "../../types";

export default function TestModePage() {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const { setId, setName, cards, startSession } = useStudyStore();

  useEffect(() => {
    if (setId !== id) {
      const set = MOCK_SETS.find((s) => s._id === id);
      const setCards = MOCK_FLASHCARDS.filter((c) => c.setId === id);
      if (set && setCards.length > 0) {
        startSession(set._id, set.name, setCards, "test");
      }
    }
  }, [id, setId, startSession]);

  // Generate test questions
  useEffect(() => {
    if (cards.length === 0) return;

    const testQuestions: TestQuestion[] = [];
    const shuffledCards = shuffle([...cards]).slice(0, 20); // max 20 questions

    shuffledCards.forEach((card, index) => {
      // Alternate question types based on index
      if (index % 3 === 0) {
        // Multiple choice
        const wrongOptions = cards
          .filter((c) => c._id !== card._id)
          .map((c) => c.back)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        testQuestions.push({
          id: `q_${card._id}`,
          type: "multiple-choice",
          question: card.front,
          options: shuffle([card.back, ...wrongOptions]),
          correctAnswer: card.back,
          flashcardId: card._id,
        });
      } else if (index % 3 === 1) {
        // True/False
        const isTrue = Math.random() > 0.5;
        const displayBack = isTrue
          ? card.back
          : cards.filter((c) => c._id !== card._id)[
              Math.floor(Math.random() * (cards.length - 1))
            ].back;

        testQuestions.push({
          id: `q_${card._id}`,
          type: "true-false",
          question: `Định nghĩa của "${card.front}" là:\n\n"${displayBack}"\n\nĐiều này đúng hay sai?`,
          correctAnswer: isTrue,
          flashcardId: card._id,
        });
      } else {
        // Fill blank (Write)
        testQuestions.push({
          id: `q_${card._id}`,
          type: "fill-blank",
          question: card.back, // Show definition, ask for term
          correctAnswer: card.front,
          flashcardId: card._id,
        });
      }
    });

    setQuestions(testQuestions);
    setAnswers({});
    setIsSubmitted(false);
    setResult(null);
  }, [cards]);

  const handleAnswerChange = (questionId: string, answer: string | boolean) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (
      Object.keys(answers).length < questions.length &&
      !confirm("Bạn chưa trả lời hết các câu hỏi. Bạn có chắc muốn nộp bài?")
    ) {
      return;
    }

    let correct = 0;
    const answerResults = questions.map((q) => {
      const userAnswer = answers[q.id];
      let isCorrect = false;

      if (q.type === "fill-blank") {
        isCorrect =
          typeof userAnswer === "string" &&
          userAnswer.toLowerCase().trim() ===
            (q.correctAnswer as string).toLowerCase().trim();
      } else {
        isCorrect = userAnswer === q.correctAnswer;
      }

      if (isCorrect) correct++;

      return {
        questionId: q.id,
        userAnswer,
        isCorrect,
      };
    });

    setResult({
      score: Math.round((correct / questions.length) * 100),
      correct,
      incorrect: questions.length - correct,
      total: questions.length,
      duration: 0, // Would be calculated with a timer
      answers: answerResults,
    });
    setIsSubmitted(true);
  };

  if (!cards.length || !questions.length) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border bg-card shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Link
            to={`/sets/${setId}`}
            className="p-2 -ml-2 rounded-xl hover:bg-accent text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-foreground truncate">
              {setName}
            </h1>
            <p className="text-xs text-muted-foreground">Test Mode</p>
          </div>
        </div>
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Nộp bài
          </button>
        ) : (
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Làm lại
          </button>
        )}
      </header>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-3xl mx-auto w-full">
        {isSubmitted && result && (
          <div className="bg-card border border-border rounded-3xl p-8 mb-8 text-center animate-slide-in-up">
            <Award
              className={cn(
                "w-16 h-16 mx-auto mb-4",
                result.score >= 80
                  ? "text-success"
                  : result.score >= 50
                    ? "text-warning"
                    : "text-destructive",
              )}
            />
            <h2 className="text-2xl font-bold mb-2">
              {result.score >= 80
                ? "Xuất sắc!"
                : result.score >= 50
                  ? "Khá tốt!"
                  : "Cần cố gắng hơn"}
            </h2>
            <div className="text-5xl font-bold mb-6 gradient-text">
              {result.score}%
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex flex-col">
                <span className="font-bold text-success text-xl">
                  {result.correct}
                </span>{" "}
                Đúng
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-destructive text-xl">
                  {result.incorrect}
                </span>{" "}
                Sai
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-xl">
                  {Object.keys(answers).length -
                    result.correct -
                    result.incorrect}
                </span>{" "}
                Bỏ trống
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {questions.map((q, index) => {
            const userAnswer = answers[q.id];
            let statusColor = "";
            let statusIcon = null;

            if (isSubmitted) {
              const isCorrect =
                q.type === "fill-blank"
                  ? typeof userAnswer === "string" &&
                    userAnswer.toLowerCase().trim() ===
                      (q.correctAnswer as string).toLowerCase().trim()
                  : userAnswer === q.correctAnswer;

              statusColor = isCorrect
                ? "border-success bg-success/5"
                : "border-destructive bg-destructive/5";
              statusIcon = isCorrect ? (
                <span className="text-success font-bold text-lg">✓</span>
              ) : (
                <span className="text-destructive font-bold text-lg">✗</span>
              );
            }

            return (
              <div
                key={q.id}
                className={cn(
                  "bg-card border rounded-2xl p-6 transition-colors",
                  isSubmitted ? statusColor : "border-border",
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                      Câu {index + 1} •{" "}
                      {q.type === "multiple-choice"
                        ? "Trắc nghiệm"
                        : q.type === "true-false"
                          ? "Đúng/Sai"
                          : "Điền từ"}
                    </span>
                    <p className="text-lg font-medium whitespace-pre-line">
                      {q.question}
                    </p>
                  </div>
                  {statusIcon}
                </div>

                <div className="mt-6">
                  {q.type === "multiple-choice" && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {q.options?.map((opt, i) => {
                        const isSelected = userAnswer === opt;
                        const isCorrectOption = opt === q.correctAnswer;

                        let btnClass =
                          "border-border hover:border-primary/50 bg-card text-foreground";
                        if (isSubmitted) {
                          if (isCorrectOption)
                            btnClass =
                              "border-success bg-success/10 text-success font-semibold";
                          else if (isSelected)
                            btnClass =
                              "border-destructive bg-destructive/10 text-destructive";
                          else btnClass = "border-border opacity-50";
                        } else if (isSelected) {
                          btnClass =
                            "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary";
                        }

                        return (
                          <button
                            key={i}
                            disabled={isSubmitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={cn(
                              "p-4 rounded-xl border text-left text-sm transition-all",
                              btnClass,
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "true-false" && (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        disabled={isSubmitted}
                        onClick={() => handleAnswerChange(q.id, true)}
                        className={cn(
                          "p-4 rounded-xl border text-center font-medium transition-all",
                          isSubmitted && q.correctAnswer === true
                            ? "border-success bg-success/10 text-success"
                            : isSubmitted && userAnswer === true
                              ? "border-destructive bg-destructive/10 text-destructive"
                              : userAnswer === true && !isSubmitted
                                ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                : "border-border hover:bg-accent",
                        )}
                      >
                        Đúng
                      </button>
                      <button
                        disabled={isSubmitted}
                        onClick={() => handleAnswerChange(q.id, false)}
                        className={cn(
                          "p-4 rounded-xl border text-center font-medium transition-all",
                          isSubmitted && q.correctAnswer === false
                            ? "border-success bg-success/10 text-success"
                            : isSubmitted && userAnswer === false
                              ? "border-destructive bg-destructive/10 text-destructive"
                              : userAnswer === false && !isSubmitted
                                ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                : "border-border hover:bg-accent",
                        )}
                      >
                        Sai
                      </button>
                    </div>
                  )}

                  {q.type === "fill-blank" && (
                    <div>
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={typeof userAnswer === "string" ? userAnswer : ""}
                        onChange={(e) =>
                          handleAnswerChange(q.id, e.target.value)
                        }
                        placeholder="Nhập câu trả lời..."
                        className={cn(
                          "w-full px-4 py-3 rounded-xl border bg-card outline-none transition-all",
                          isSubmitted &&
                            typeof userAnswer === "string" &&
                            userAnswer.toLowerCase().trim() ===
                              (q.correctAnswer as string).toLowerCase().trim()
                            ? "border-success text-success bg-success/5"
                            : isSubmitted &&
                                typeof userAnswer === "string" &&
                                userAnswer !== ""
                              ? "border-destructive text-destructive bg-destructive/5 line-through decoration-destructive/50"
                              : "border-border focus:border-primary",
                        )}
                      />
                      {isSubmitted &&
                        (typeof userAnswer !== "string" ||
                          userAnswer.toLowerCase().trim() !==
                            (q.correctAnswer as string)
                              .toLowerCase()
                              .trim()) && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">
                              Đáp án đúng:{" "}
                            </span>
                            <span className="font-semibold text-success">
                              {q.correctAnswer as string}
                            </span>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
