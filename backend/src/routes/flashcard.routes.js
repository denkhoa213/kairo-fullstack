import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  getFlashcards,
  createFlashcards,
  updateFlashcard,
  deleteFlashcard,
} from "../controllers/flashcard.controller.js";

const router = express.Router();

// Nested under sets
router.get("/sets/:setId/cards", getFlashcards);
router.post("/sets/:setId/cards", protectedRoute, createFlashcards);

// Individual card operations
router.put("/cards/:id", protectedRoute, updateFlashcard);
router.delete("/cards/:id", protectedRoute, deleteFlashcard);

export default router;
