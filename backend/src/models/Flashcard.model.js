import mongoose from "mongoose";

export const flashCardSchema = new mongoose.Schema(
  {
    setId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlashCardSet",
      required: true,
      index: true,
      description: "",
    },
    front: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
      description: "Mặt trước của thẻ",
    },
    back: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
      description: "Mặt sau của thẻ",
    },
    imageFront: {
      type: String,
      trim: true,
      description: "URL ảnh mặt trước",
    },
    imageBack: {
      type: String,
      trim: true,
      description: "URL ảnh mặt sau",
    },
    type: {
      type: String,
      enum: ["Text", "Image", "Audio"],
      default: "Text",
      description: "Loại thẻ (Text, Image, Audio)",
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
      description: "Thứ tự trong bộ",
    },
  },
  { timestamps: true },
);

const FlashCard = mongoose.model("FlashCard", flashCardSchema);
export default FlashCard;
