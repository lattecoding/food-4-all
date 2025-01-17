import { User } from "../models/user.js";

export const seedUsers = async () => {
  await User.bulkCreate(
    [
      { username: "Jessica", password: "password" },
      { username: "Netra", password: "password" },
      { username: "Lori", password: "password" },
      { username: "Luis", password: "password" },
    ],
    { individualHooks: true },
  );
};
