/**
 * SM-2 Spaced Repetition Algorithm
 * Based on: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 *
 * Quality ratings (q):
 *   0 - Complete blackout
 *   1 - Incorrect response; correct one was easy to recall
 *   2 - Incorrect response; correct one seemed easy to recall
 *   3 - Correct response recalled with serious difficulty
 *   4 - Correct response after a hesitation
 *   5 - Perfect response
 */

const MIN_EASE_FACTOR = 1.3;

/**
 * Calculate the next review parameters after a card review.
 * @param {Object} progress - The current progress record for this card
 * @param {number} quality - Rating 0-5 given by the user
 * @returns {Object} - Updated { interval, easeFactor, repetitions, nextReviewDate, state }
 */
export function calculateNextReview(progress, quality) {
  let { interval, easeFactor, repetitions } = progress;

  // Clamp quality
  quality = Math.max(0, Math.min(5, quality));

  let newInterval;
  let newEaseFactor = easeFactor;
  let newRepetitions = repetitions;
  let state;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;
    state =
      newInterval >= 21 ? "mastered" : newInterval >= 7 ? "review" : "learning";
  } else {
    // Incorrect response — reset to beginning
    newInterval = 1;
    newRepetitions = 0;
    state = "learning";
  }

  // Update ease factor
  newEaseFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor);

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
    nextReviewDate,
    state,
  };
}

/**
 * Convert a simple boolean (correct/incorrect) to a quality rating.
 * Used for study modes that don't support granular ratings.
 * @param {boolean} correct
 * @returns {number} quality (5 for correct, 1 for incorrect)
 */
export function booleanToQuality(correct) {
  return correct ? 5 : 1;
}

/**
 * Calculate XP earned for a study session.
 * @param {number} correct
 * @param {number} total
 * @param {string} mode - study mode name
 * @returns {number} XP
 */
export function calculateXP(correct, total, mode) {
  const modeMultipliers = {
    flashcard: 1,
    learn: 1.5,
    write: 2,
    test: 2,
    match: 1.5,
    speed: 2,
  };
  const multiplier = modeMultipliers[mode] || 1;
  const baseXP = correct * 10;
  const bonusXP = total > 0 && correct === total ? Math.round(total * 5) : 0;
  return Math.round((baseXP + bonusXP) * multiplier);
}
