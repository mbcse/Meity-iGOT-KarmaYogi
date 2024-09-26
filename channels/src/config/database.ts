import mongoose from "mongoose";
import dotenv from "dotenv";
import {dbUrl} from "../config";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl as string);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;
