import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("🟢 MongoDB connected successfully!");
    console.log("yo! vim is the best editor");
  } catch (err) {
    console.error("🔴 Failed to connect to MongoDB:", err);
    process.exit(1); // Optional: Stop the app if DB fails
  }
};
