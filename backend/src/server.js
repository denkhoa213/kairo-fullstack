import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import userRoute from "./routes/user.routes.js";
import authRoute from "./routes/auth.routes.js";
import flashcardSetRoute from "./routes/flashcardSet.routes.js";
import flashcardRoute from "./routes/flashcard.routes.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { initSocket } from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// routes public
app.use("/api/auth", authRoute);
app.use("/api/sets", flashcardSetRoute);
app.use("/api", flashcardRoute);

// routes private
app.use(protectedRoute);
app.use("/api/users", userRoute);

// error handler
app.use(errorHandler);

connectDB()
  .then(() => {
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
    process.exit(1);
  });
