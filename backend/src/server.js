import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";

// Routes
import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import flashcardSetRoute from "./routes/flashcardSet.routes.js";
import flashcardRoute from "./routes/flashcard.routes.js";
import studyRoute from "./routes/study.routes.js";
import progressRoute from "./routes/progress.routes.js";
import aiRoute from "./routes/ai.routes.js";

import { protectedRoute } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { initSocket } from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ── Public Routes (no auth required) ─────────────────────────────────────────
app.use("/api/auth", authRoute);
app.use("/api/sets", flashcardSetRoute);   // Some endpoints are public (GET)
app.use("/api", flashcardRoute);           // GET /api/sets/:setId/cards is public
app.use("/api/ai", aiRoute);               // POST /api/ai/generate (protected inside route)

// ── Protected Routes (auth required) ─────────────────────────────────────────
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/study", studyRoute);
app.use("/api/progress", progressRoute);

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  });
