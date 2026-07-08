import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinSet", (setId) => {
      socket.join(`set:${setId}`);
    });

    socket.on("leaveSet", (setId) => {
      socket.leave(`set:${setId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }
  return io;
};
