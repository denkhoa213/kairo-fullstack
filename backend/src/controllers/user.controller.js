import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import FlashcardSet from "../models/FlashcardSet.model.js";
import ReviewHistory from "../models/ReviewHistory.model.js";
import Progress from "../models/Progress.model.js";

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const profileController = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Update profile (name, bio, avatar)
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, firstName, lastName, bio, avatar, settings } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, firstName, lastName, bio, avatar, settings },
      { new: true, runValidators: true }
    ).select("-hashedPassword");

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }

    const user = await User.findById(req.user._id);
    const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    user.hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile of any user by ID
// @route   GET /api/users/:id
// @access  Public
export const getPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("name firstName lastName avatar bio streak createdAt xp");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [setsCreated, masteredCards] = await Promise.all([
      FlashcardSet.countDocuments({ userId: id, isPublic: true }),
      Progress.countDocuments({ userId: id, state: "mastered" }),
    ]);

    return res.status(200).json({
      success: true,
      data: { ...user.toObject(), setsCreated, masteredCards },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's full stats (for dashboard)
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalCards, masteredCards, setsCount, history, user] = await Promise.all([
      Progress.countDocuments({ userId }),
      Progress.countDocuments({ userId, state: "mastered" }),
      FlashcardSet.countDocuments({ userId }),
      ReviewHistory.find({ userId }).sort({ createdAt: -1 }).limit(14),
      User.findById(userId).select("streak xp"),
    ]);

    const totalStudyTime = history.reduce((acc, h) => acc + (h.durationSeconds || 0), 0);
    const totalCardsReviewed = history.reduce((acc, h) => acc + (h.cardsReviewed || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalCards,
        masteredCards,
        setsCount,
        totalStudyTime,
        totalCardsReviewed,
        streak: user?.streak ?? 0,
        xp: user?.xp ?? 0,
        recentSessions: history,
      },
    });
  } catch (error) {
    next(error);
  }
};
