import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
      console.log("DB Connected Successfully");
    } catch (error) {
      console.log("Error while connecting DB", error);
    }
  }
};
