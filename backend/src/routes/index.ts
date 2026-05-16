import { Express } from "express";
import authRouter from "./authRoutes.js";

export default function routes(app: Express) {
  app.use("/api/auth", authRouter);
}
