import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configure dotenv to load variables from the root directory
dotenv.config({ path: '.env' });

const connectDB = async () => {
  const mongoURI = process.env.URI;

  if (!mongoURI) {
    console.error("URI environment variable is not set.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;