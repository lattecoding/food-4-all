import bcrypt from "bcrypt";
import User from "../models/User.js";

const saltRounds = 10;

export const seedUsers = async () => {
  const userData = [
    { username: "Jessica", password: "password" },
    { username: "Netra", password: "password" },
    { username: "Lori", password: "password" },
    { username: "Luis", password: "password" },
  ];

  // Hash passwords before inserting
  for (let user of userData) {
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(user.password, salt);
  }

  // Using insertMany for multiple documents:
  await User.insertMany(userData);
  console.log("Seed data inserted successfully");
};
