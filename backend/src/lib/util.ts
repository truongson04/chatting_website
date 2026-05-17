import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("There is invalid secret JWT key");
  }
  const token: string = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "develop",
  });
};
