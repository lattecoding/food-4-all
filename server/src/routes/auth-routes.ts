import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the password with the hashed password stored in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET_KEY as string, // Ensure this key is in your .env
      { expiresIn: "1h" },
    );

    // Return the token in the response
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST route for login
const router = Router();
router.post("/login", login);

export default router;
