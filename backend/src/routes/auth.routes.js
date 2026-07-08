import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  meController,
  refreshTokenController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/forgot-password", forgotPasswordController);
router.get("/me", protectedRoute, meController);
router.post("/refresh", refreshTokenController);

export default router;
