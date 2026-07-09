import express from "express";
import { optionalAuth, protectedRoute } from "../middlewares/auth.middleware.js";
import {
  listFlashcardSets,
  getFlashcardSet,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
  toggleLikeSet,
  getMySets,
} from "../controllers/flashcardSet.controller.js";

const router = express.Router();

// Public
router.get("/", listFlashcardSets);
router.get("/my", protectedRoute, getMySets);
router.get("/:id", optionalAuth, getFlashcardSet);

// Private
router.post("/", protectedRoute, createFlashcardSet);
router.put("/:id", protectedRoute, updateFlashcardSet);
router.delete("/:id", protectedRoute, deleteFlashcardSet);
router.post("/:id/like", protectedRoute, toggleLikeSet);

export default router;
