import mongoose, { Schema } from "mongoose";

export const tagSchema = new mongoose.Schema(
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
      description: "",
    },
  },
  { timestamps: true },
);

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
