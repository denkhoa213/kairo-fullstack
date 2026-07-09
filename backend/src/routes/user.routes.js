import express from "express";
import {
  profileController,
  updateProfile,
  changePassword,
  getPublicProfile,
  getUserStats,
} from "../controllers/user.controller.js";

const router = express.Router();

// All these routes are behind protectedRoute (set globally in server.js)
router.get("/profile", profileController);
router.put("/profile", updateProfile);
router.put("/password", changePassword);
router.get("/stats", getUserStats);

// Public profile — this route must be last to avoid conflicting with /profile
router.get("/:id", getPublicProfile);

export default router;
