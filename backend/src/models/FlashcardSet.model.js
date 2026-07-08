import mongoose from "mongoose";

export const flashcardSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      description: "Tên bộ thẻ",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      description: "Mô tả bộ thẻ",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      description: "",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
      description: "",
    },
    isPublic: {
      type: Boolean,
      default: true,
      description: "Công khai / Riêng tư",
    },
    totalCards: {
      type: Number,
      default: 0,
      min: 0,
      description: "Tổng số thẻ trong bộ",
    },
    favoriteCount: {
      type: Number,
      default: 0,
      min: 0,
      description: "Số lượt thích",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      description: "Điểm trung bình",
    },
    image: {
      type: String,
      trim: true,
      description: "URL ảnh bìa",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        description: "Tag",
      },
    ],
  },
  { timestamps: true },
);

const FlashcardSet = mongoose.model("FlashcardSet", flashcardSetSchema);

export default FlashcardSet;
