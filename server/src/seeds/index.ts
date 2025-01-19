import mongoose from "mongoose";
import { seedUsers } from "./user-seeds.js";

// You might want to load environment variables from .env
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/food4all-db";

async function seedAll() {
  try {
    // 1) Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB.");

    // 2) Optional: Clean the DB
    //    If you have multiple models, you could clear them all here.
    //    For example: await mongoose.connection.dropDatabase();
    //    Or just clean one collection:
    //    await User.deleteMany({});

    // 3) Seed data
    await seedUsers();
    console.log("Users seeded!");

    // 4) Close out
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedAll();
