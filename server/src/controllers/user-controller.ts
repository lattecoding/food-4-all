import { Request, Response } from "express";
import User from "../models/User.js";

// GET /Users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    // Mongoose: .find() retrieves all documents
    // .select("-password") excludes the `password` field in the result
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /Users/:id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Mongoose: .findById() to find by _id
    const user = await User.findById(id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /Users
export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // Mongoose: .create() to insert a new document
    const newUser = await User.create({ username, password });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /Users/:id
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    // Mongoose: .findByIdAndUpdate()
    // { new: true } returns the updated document
    const user = await User.findByIdAndUpdate(
      id,
      { username, password },
      { new: true },
    ).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /Users/:id
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Mongoose: .findByIdAndDelete()
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
