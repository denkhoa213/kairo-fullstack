import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    flashcardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flashcard",
      required: true,
      index: true,
    },
    setId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashcardSet",
      required: true,
      index: true,
    },
    state: {
      type: String,
      enum: ["new", "learning", "review", "mastered"],
      default: "new",
    },
    // Spaced Repetition (SM-2 Algorithm variables)
    nextReviewDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    interval: {
      type: Number,
      default: 0, // Days
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    repetitions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index for quick lookups
progressSchema.index({ userId: 1, flashcardId: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
