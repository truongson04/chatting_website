import { Express } from "express";
import authRouter from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import messageRouters from "./messageRoutes.js";

export default function routes(app: Express) {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRoutes);
  app.use("/api/message", messageRouters);
}
