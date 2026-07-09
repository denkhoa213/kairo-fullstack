import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { getSetProgress, resetSetProgress } from "../controllers/progress.controller.js";

const router = express.Router();

router.get("/:setId", protectedRoute, getSetProgress);
router.delete("/:setId/reset", protectedRoute, resetSetProgress);

export default router;
