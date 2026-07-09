import Progress from "../models/Progress.model.js";
import ReviewHistory from "../models/ReviewHistory.model.js";
import FlashCard from "../models/Flashcard.model.js";
import User from "../models/User.model.js";
import { calculateNextReview, booleanToQuality, calculateXP } from "../services/spacedRepetition.service.js";

// @desc    Start/get cards due for review for a given set
// @route   GET /api/study/:setId/due
// @access  Private
export const getDueCards = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const userId = req.user._id;

    const allCards = await FlashCard.find({ setId });
    const progressRecords = await Progress.find({ userId, setId });

    const progressMap = {};
    progressRecords.forEach((p) => {
      progressMap[p.flashcardId.toString()] = p;
    });

    const now = new Date();
    const dueCards = allCards.filter((card) => {
      const progress = progressMap[card._id.toString()];
      if (!progress) return true; // New card, always due
      return progress.nextReviewDate <= now; // Due for review
    });

    return res.status(200).json({
      success: true,
      data: {
        dueCards,
        total: dueCards.length,
        allTotal: allCards.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a card review result (updates spaced repetition data)
// @route   POST /api/study/review
// @access  Private
export const reviewCard = async (req, res, next) => {
  try {
    const { flashcardId, setId, correct, quality } = req.body;
    const userId = req.user._id;

    // quality: optional 0-5 granular rating; fallback to boolean
    const reviewQuality = quality !== undefined ? quality : booleanToQuality(correct);

    let progress = await Progress.findOne({ userId, flashcardId });

    if (!progress) {
      // First time seeing this card
      progress = new Progress({
        userId,
        flashcardId,
        setId,
        state: "new",
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(),
      });
    }

    const updated = calculateNextReview(progress, reviewQuality);

    progress.interval = updated.interval;
    progress.easeFactor = updated.easeFactor;
    progress.repetitions = updated.repetitions;
    progress.nextReviewDate = updated.nextReviewDate;
    progress.state = updated.state;

    await progress.save();

    return res.status(200).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a study session and save history
// @route   POST /api/study/session/complete
// @access  Private
export const completeSession = async (req, res, next) => {
  try {
    const {
      setId,
      mode,
      cardsReviewed,
      correctCount,
      incorrectCount,
      durationSeconds,
    } = req.body;

    const userId = req.user._id;
    const score = cardsReviewed > 0 ? Math.round((correctCount / cardsReviewed) * 100) : 0;
    const xpEarned = calculateXP(correctCount, cardsReviewed, mode);

    const history = await ReviewHistory.create({
      userId,
      setId,
      mode,
      cardsReviewed,
      correctCount,
      incorrectCount,
      score,
      durationSeconds,
      xpEarned,
    });

    // Award XP to user (increment totalXP on user document)
    await User.findByIdAndUpdate(userId, {
      $inc: { xp: xpEarned },
    });

    return res.status(201).json({
      success: true,
      data: { history, xpEarned, score },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get study stats for a user
// @route   GET /api/study/stats
// @access  Private
export const getStudyStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalCards, masteredCards, history] = await Promise.all([
      Progress.countDocuments({ userId }),
      Progress.countDocuments({ userId, state: "mastered" }),
      ReviewHistory.find({ userId }).sort({ createdAt: -1 }).limit(30),
    ]);

    // Calculate study streak (consecutive days with at least one session)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionDays = new Set(
      history.map((h) => {
        const d = new Date(h.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.toDateString();
      })
    );

    let streak = 0;
    let checkDate = new Date(today);
    while (sessionDays.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const totalStudyTime = history.reduce((acc, h) => acc + (h.durationSeconds || 0), 0);
    const totalCardsReviewed = history.reduce((acc, h) => acc + (h.cardsReviewed || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalCards,
        masteredCards,
        streak,
        totalStudyTime,
        totalCardsReviewed,
        recentSessions: history,
      },
    });
  } catch (error) {
    next(error);
  }
};
