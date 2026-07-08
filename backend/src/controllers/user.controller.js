export const profileController = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
