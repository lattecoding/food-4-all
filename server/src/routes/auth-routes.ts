import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // Find the user by username (Mongoose syntax, no "where")
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the password with the hashed password stored in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    // Use user._id or define a virtual "id" if you want "id" in the token.
    const token = jwt.sign(
      { username: user.username, userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" },
    );

    // Return the token
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Import/Compose router
const router = Router();
router.post("/login", login);

export default router;
