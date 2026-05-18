import express from "express";
import { protectRoute } from "../middleware/auth.Middlewares.js";
import {
  getMessages,
  getUsersForSideBar,
  sendMessage,
} from "../controllers/messageControllers.js";
const messageRouters = express.Router();
messageRouters.get("/users", protectRoute, getUsersForSideBar);
messageRouters.get("/:id", protectRoute, getMessages);
messageRouters.post("/send/:id", protectRoute, sendMessage);
export default messageRouters;
