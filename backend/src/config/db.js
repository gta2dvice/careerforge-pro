import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new ApiError(500, "MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "career",
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    return conn;
  } catch (err) {
    throw new ApiError(500, "Database connection failed", [], err.stack);
  }
};

export { connectDB };
