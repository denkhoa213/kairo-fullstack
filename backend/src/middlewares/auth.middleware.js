import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập!",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {
      if (err) {
        return res.status(403).json({
          message: "Không có quyền truy cập!",
        });
      }

      const user = await User.findById(decodedUser.userId).select(
        "-password -refreshToken",
      );
      if (!user) {
        return res.status(404).json({
          message: "Không tìm thấy user!",
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
