import { Schema, model, Document, Types } from "mongoose";

// Define the Restaurant document interface
export interface IRestaurant extends Document {
  restaurantName: string;
  foodType: string;
  website?: string; // Made optional in case not all restaurants have a website
  location: string;
  rating: number;
  addedBy: Types.ObjectId; // Reference to the User who added the restaurant
}

// Define the Restaurant schema
const restaurantSchema = new Schema<IRestaurant>(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    foodType: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      validate: {
        validator: (v: string) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(v),
        message: "Invalid URL format for the website.",
      },
      trim: true, // Optional: Trim whitespace from the website
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5, // Assuming a 5-star rating system
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure every restaurant is linked to a user
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  },
);

// Define and export the Restaurant model
const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);

export default Restaurant;
