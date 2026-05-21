import { Request, Response } from "express";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiveSocketId, io } from "../lib/socket.io.js";
export const getUsersForSideBar = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");
    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userToChatId = req.params.id;
    const currentUserId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiveId: userToChatId },
        { senderId: userToChatId, receiveId: currentUserId },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { text, image } = req.body;
    const receiveId = req.params.id;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      // upload to cloud
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiveId,
      text,
      image: imageUrl,
    });
    // socket io part
    const receiveSocketId = getReceiveSocketId(receiveId as string);
    if (receiveSocketId) {
      io.to(receiveSocketId).emit("newMessage", newMessage); // thêm to vào chỉ gửi cho máy socket có id đấy
    }
    await newMessage.save();
    return res.status(200).json({ newMessage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
