import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { AUTH_MESSAGES } from "../constants/messages.constants.js";

export const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {
      if (err) {
        return res.status(403).json({
          message: AUTH_MESSAGES.FORBIDDEN,
        });
      }

      const user = await User.findById(decodedUser.userId).select(
        "-hashedPassword ",
      );
      if (!user) {
        return res.status(404).json({
          message: AUTH_MESSAGES.USER_NOT_FOUND,
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
