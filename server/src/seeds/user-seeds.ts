import User from "../models/user.js";

export const seedUsers = async () => {
  const userData = [
    { username: "Jessica", password: "password" },
    { username: "Netra", password: "password" },
    { username: "Lori", password: "password" },
    { username: "Luis", password: "password" },
  ];

  // Using insertMany for multiple documents:
  await User.insertMany(userData);
};
