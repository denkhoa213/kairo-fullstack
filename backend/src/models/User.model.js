import mongoose from "mongoose";
import { ROLES } from "../constants/roles.constants.js";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ!",
      ],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Tên là bắt buộc"],
      trim: true,
      maxlength: [50, "Tên không được vượt quá 50 ký tự"],
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [200, "Tiểu sử không được vượt quá 200 ký tự"],
      default: "",
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    premiumExpiry: {
      type: Date,
      default: null,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
      default: null,
    },
    totalStudyTime: {
      type: Number,
      default: 0,
    },
    totalCardsLearned: {
      type: Number,
      default: 0,
    },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      language: {
        type: String,
        default: "vi",
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    refreshToken: {
      type: String,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
UserSchema.virtual("isPremium").get(function () {
  if (!this.premiumExpiry) return false;
  return this.premiumExpiry > new Date();
});

UserSchema.virtual("isLocked").get(function () {
  if (!this.lockUntil) return false;
  return this.lockUntil > new Date();
});

UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Methods
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.__v;
  return user;
};

const User = mongoose.model("User", UserSchema);

export default User;
