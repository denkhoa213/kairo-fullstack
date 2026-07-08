import mongoose, { Schema } from "mongoose";

export const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      description: "",
      index: true,
    },
    description: {
      type: String,
      trim: true,
      description: "Mô tả danh mục",
    },
  },
  { timestamps: true },
);

// Tạo index cho tìm kiếm nhanh
categorySchema.index({ slug: 1 });
categorySchema.index({ createdAt: -1 });

// Virtual field: lấy danh sách bộ thẻ
categorySchema.virtual("flashcardSets", {
  ref: "FlashcardSet",
  localField: "_id",
  foreignField: "categoryId",
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
