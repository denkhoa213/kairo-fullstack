import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const SOCKET_URL = API_URL.replace(/\/api$/, "") || "http://localhost:5001";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export const joinSetRoom = (setId: string) => {
  if (!setId) return;
  socket.emit("joinSet", setId);
};

export const leaveSetRoom = (setId: string) => {
  if (!setId) return;
  socket.emit("leaveSet", setId);
};
