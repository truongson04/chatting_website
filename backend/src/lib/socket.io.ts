import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Express } from "express";
const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
// Lưu trữ người dùng nào đang online
const socketMap = new Map<string, string>();
// Hàm lấy id socket từ id của người dùng
export const getReceiveSocketId = (userId: string): string | undefined => {
  return socketMap.get(userId);
};
io.on("connection", (socket) => {
  console.log("Someone has connected ", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    socketMap.set(userId as string, socket.id);
  }
  io.emit("getAllOnline", [...socketMap.keys()]);
  socket.on("disconnect", () => {
    console.log("Someone leave", socket.id);
    socketMap.delete(userId as string);
    io.emit("getAllOnline", [...socketMap.keys()]);
  });
});
export { io, app, server };
