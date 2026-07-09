import Progress from "../models/Progress.model.js";

// @desc    Get progress for all cards in a set for the current user
// @route   GET /api/progress/:setId
// @access  Private
export const getSetProgress = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const userId = req.user._id;

    const progress = await Progress.find({ userId, setId });

    const summary = {
      total: progress.length,
      new: progress.filter((p) => p.state === "new").length,
      learning: progress.filter((p) => p.state === "learning").length,
      review: progress.filter((p) => p.state === "review").length,
      mastered: progress.filter((p) => p.state === "mastered").length,
    };

    return res.status(200).json({
      success: true,
      data: { progress, summary },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset progress for a set
// @route   DELETE /api/progress/:setId/reset
// @access  Private
export const resetSetProgress = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const userId = req.user._id;

    await Progress.deleteMany({ userId, setId });

    return res.status(200).json({
      success: true,
      message: "Progress reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
