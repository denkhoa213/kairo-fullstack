import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { generateFlashcards } from "../controllers/ai.controller.js";

const router = express.Router();

// Protected — must be logged in to use AI
router.post("/generate", protectedRoute, generateFlashcards);

export default router;
