import mongoose from "mongoose";
import dotenv from "dotenv";
import {dbUrl,dbName,dbPass,dbUser} from "../config";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbUrl as string,
     {
      dbName:dbName,
      user:dbUser,
      pass:dbPass
     }
  );
    
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1); // Exit process if connection fails
  }
};

export default connectDB;
