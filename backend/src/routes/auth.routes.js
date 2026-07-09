import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/forgot-password", forgotPasswordController);

export default router;
