import express from "express";
import { checkAuth, updateProfile } from "../controllers/userControllers.js";
import { protectRoute } from "../middleware/auth.Middlewares.js";
const userRoutes = express.Router();
userRoutes.patch("/update-profile", protectRoute, updateProfile);
userRoutes.get("/check", protectRoute, checkAuth);
export default userRoutes;
