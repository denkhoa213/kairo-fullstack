import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  listFlashcardSets,
  getFlashcardSet,
  createFlashcardSet,
  updateFlashcardSet,
  deleteFlashcardSet,
} from "../controllers/flashcardSet.controller.js";

const router = express.Router();

router.get("/", listFlashcardSets);
router.get("/:id", getFlashcardSet);
router.post("/", protectedRoute, createFlashcardSet);
router.put("/:id", protectedRoute, updateFlashcardSet);
router.delete("/:id", protectedRoute, deleteFlashcardSet);

export default router;
