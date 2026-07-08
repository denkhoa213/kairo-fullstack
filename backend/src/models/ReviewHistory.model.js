import mongoose from "mongoose";

const reviewHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    setId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashcardSet",
      required: true,
      index: true,
    },
    mode: {
      type: String,
      required: true,
      enum: ["flashcard", "learn", "write", "test", "match", "speed"],
    },
    cardsReviewed: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    incorrectCount: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number, // Percentage or absolute points based on mode
      default: 0,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ReviewHistory = mongoose.model("ReviewHistory", reviewHistorySchema);
export default ReviewHistory;
