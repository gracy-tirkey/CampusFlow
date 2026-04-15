import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Note from "./models/Note.js";
import Doubt from "./models/Doubt.js";

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ Missing MONGO_URI in .env file");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Sample data generators
const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
  "Geography",
  "Economics",
];
const grades = ["9th", "10th", "11th", "12th", "Undergraduate", "Graduate"];
const roles = ["student", "teacher"];

const generateRandomUser = async () => {
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Eve Wilson",
    "Frank Miller",
    "Grace Lee",
    "Henry Davis",
    "Ivy Chen",
    "Jack Taylor",
  ];
  const name = names[Math.floor(Math.random() * names.length)];
  const uniqueId = Math.random().toString(36).substr(2, 9);
  const email = `${name.toLowerCase().replace(" ", ".")}.${uniqueId}@example.com`;
  const role = roles[Math.floor(Math.random() * roles.length)];
  const grade = grades[Math.floor(Math.random() * grades.length)];
  const userSubjects = subjects.slice(0, Math.floor(Math.random() * 3) + 1);

  // Hash the password
  const hashedPassword = await bcrypt.hash("password123", 10);

  return {
    name,
    email,
    password: hashedPassword,
    role,
    grade,
    subjects: userSubjects,
    institution: "Sample University",
    isEmailVerified: true,
  };
};

const generateRandomNote = (userId) => {
  const titles = [
    "Introduction to Calculus",
    "Quantum Physics Basics",
    "Organic Chemistry Reactions",
    "Cell Biology Fundamentals",
    "Data Structures and Algorithms",
    "Shakespeare Analysis",
    "World War II History",
    "Geography of Continents",
    "Microeconomics Principles",
  ];
  const descriptions = [
    "Comprehensive notes on basic concepts",
    "Detailed explanations with examples",
    "Step-by-step problem solving guide",
    "Visual diagrams and summaries",
  ];

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    subject: subjects[Math.floor(Math.random() * subjects.length)],
    fileUrl: `https://example.com/notes/${Math.random().toString(36).substr(2, 9)}.pdf`,
    uploadedBy: userId,
    role: roles[Math.floor(Math.random() * roles.length)],
  };
};

const generateRandomDoubt = (userId) => {
  const questions = [
    "How do I solve this integral?",
    "What's the difference between mitosis and meiosis?",
    "Can someone explain recursion?",
    "Why does this chemical reaction occur?",
    "Help with this physics problem",
    "Literature analysis question",
  ];
  const tags = ["help", "urgent", "exam-prep", "concept-clarification"];

  return {
    question: questions[Math.floor(Math.random() * questions.length)],
    tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
    askedBy: userId,
  };
};

const populateDatabase = async () => {
  try {
    console.log("Starting database population...");

    // Clear existing data
    await User.deleteMany({});
    await Note.deleteMany({});
    await Doubt.deleteMany({});
    console.log("Cleared existing data");

    // Create 10 sample users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const userData = await generateRandomUser();
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.name} - Email: ${user.email}`);
    }

    // Create 50 notes
    for (let i = 0; i < 50; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const noteData = generateRandomNote(randomUser._id);
      const note = new Note(noteData);
      await note.save();
      console.log(`Created note ${i + 1}: ${note.title}`);
    }

    // Create 50 doubts
    for (let i = 0; i < 50; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const doubtData = generateRandomDoubt(randomUser._id);
      const doubt = new Doubt(doubtData);
      await doubt.save();
      console.log(`Created doubt ${i + 1}: ${doubt.question}`);
    }

    console.log("Database population completed successfully!");
    console.log("Created 10 users, 50 notes, and 50 doubts");
    console.log("Sample login credentials:");
    console.log("Email: any of the created users (check console above)");
    console.log("Password: password123");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the script
connectDB().then(() => {
  populateDatabase();
});
