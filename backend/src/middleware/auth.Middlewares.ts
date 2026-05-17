import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/userModel.js";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Cannot find the key");
    }
    const decode = jwt.verify(token, secret) as { userId: string };
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
