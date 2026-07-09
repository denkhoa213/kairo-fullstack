import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  getDueCards,
  reviewCard,
  completeSession,
  getStudyStats,
} from "../controllers/study.controller.js";

const router = express.Router();

router.get("/stats", protectedRoute, getStudyStats);
router.get("/:setId/due", protectedRoute, getDueCards);
router.post("/review", protectedRoute, reviewCard);
router.post("/session/complete", protectedRoute, completeSession);

export default router;
