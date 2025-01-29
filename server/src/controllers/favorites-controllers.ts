import { Request, Response } from "express";
import User from "../models/user.js";
import Restaurant from "../models/Restaurants.js";
import Favorite from "../models/Favorites.js";

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { userId, restaurantId } = req.body;

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({
      user: userId,
      restaurant: restaurantId,
    });
    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Restaurant is already in favorites" });
    }

    // Create a new favorite
    const favorite = new Favorite({
      user: userId,
      restaurant: restaurantId,
    });

    // Save the favorite
    await favorite.save();

    // Add the restaurant to the user's favorites array
    user.favorites.push(restaurantId);
    await user.save();

    return res
      .status(201)
      .json({ message: "Restaurant added to favorites", favorite });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
