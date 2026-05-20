import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/userModel.js";
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;
    console.log(req.body);
    const userId = req.user?._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const checkAuth = async (req: Request, res: Response) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
