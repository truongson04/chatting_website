import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error("Something went wrong");
    }

    await mongoose.connect(mongoUrl, {
      dbName: "Chat_websites",
    });
    console.log("Connect to db successfully");
  } catch (error) {
    console.error("Connection error: ", error);
  }
};
