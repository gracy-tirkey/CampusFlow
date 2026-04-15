import mongoose from "mongoose";
import dotenv from "dotenv";
import { resumeData } from "./data.js";
import Resume from "./models/Resume.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log("Seeding database with resume data...");

    // Delete existing documents in the resumes collection
    await Resume.deleteMany({});
    console.log("Cleared existing resume documents");

    // Insert all 50 documents
    await Resume.insertMany(resumeData);
    console.log("Successfully inserted 50 resume documents");
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();
  await seedDatabase();
  console.log("Seeding completed successfully");
  process.exit(0);
};

runSeeder();
