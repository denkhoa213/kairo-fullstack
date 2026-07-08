import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["streak", "cards_learned", "sets_created", "perfect_test", "level_up"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
      default: "🏆",
    },
    tier: {
      type: Number,
      default: 1, // e.g. 1 (Bronze), 2 (Silver), 3 (Gold)
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate achievements for the same user and type/tier
achievementSchema.index({ userId: 1, type: 1, tier: 1 }, { unique: true });

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;
