import User from '../models/user.js';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: { user?: any }) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).select('-password');
      }
      throw new GraphQLError('Not logged in');
    },
    users: async () => {
      return User.find().select('-password');
    },
  },
  Mutation: {
    addUser: async (_: unknown, { username, password }: { username: string; password: string }) => {
      const user = await User.create({ username, password });
      return { token: "placeholder", user };
    },
    login: async (_: unknown, { username }: { username: string; password: string }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new GraphQLError('Invalid credentials');
      }
      return { token: "placeholder", user };
    },
  },
};




// import { GraphQLError } from "graphql";
// import User from "../models/user.js";
// import Restaurant from "../models/Restaurants.js";
// import Favorite from "../models/Favorites.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// export const resolvers = {
//   Query: {
//     // Existing from your code
//     me: async (_parent, _args, context) => {
//       if (!context.user) {
//         throw new GraphQLError("Not logged in");
//       }
//       return User.findOne({ _id: context.user._id }).select("-password");
//     },
//     users: async () => {
//       return User.find().select("-password");
//     },

//     // Add new queries
//     user: async (_parent, { _id }) => {
//       return User.findById(_id).select("-password");
//     },
//     restaurants: async () => {
//       return Restaurant.find({}).populate("addedBy");
//     },
//     restaurant: async (_parent, { _id }) => {
//       return Restaurant.findById(_id).populate("addedBy");
//     },
//     favorites: async () => {
//       return Favorite.find({}).populate(["user", "restaurant"]);
//     },
//     favorite: async (_parent, { _id }) => {
//       return Favorite.findById(_id).populate(["user", "restaurant"]);
//     },
//   },

//   Mutation: {
//     // Existing
//     addUser: async (_parent, { username, password }) => {
//       const existingUser = await User.findOne({ username });
//       if (existingUser) {
//         throw new GraphQLError("Username already taken");
//       }

//       const user = await User.create({ username, password });

//       // Generate a token
//       const token = jwt.sign(
//         { userId: user._id, username: user.username },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: "1h" },
//       );

//       return { token, user };
//     },

//     login: async (_parent, { username, password }) => {
//       const user = await User.findOne({ username });
//       if (!user) {
//         throw new GraphQLError("User not found");
//       }

//       const validPw = await bcrypt.compare(password, user.password);
//       if (!validPw) {
//         throw new GraphQLError("Invalid password");
//       }

//       // Generate token
//       const token = jwt.sign(
//         { userId: user._id, username: user.username },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: "1h" },
//       );
//       return { token, user };
//     },

//     // New: CRUD for Restaurant
//     addRestaurant: async (
//       _parent,
//       { restaurantName, foodType, website, location, rating },
//       context,
//     ) => {
//       // Require login
//       if (!context.user) {
//         throw new GraphQLError("Not logged in");
//       }
//       const newRest = await Restaurant.create({
//         restaurantName,
//         foodType,
//         website,
//         location,
//         rating,
//         addedBy: context.user._id,
//       });
//       return newRest;
//     },
//     updateRestaurant: async (
//       _parent,
//       { _id, restaurantName, foodType, website, location, rating },
//       context,
//     ) => {
//       if (!context.user) {
//         throw new GraphQLError("Not logged in");
//       }
//       // Only let user who added the restaurant update it, etc.:
//       const restaurant = await Restaurant.findOneAndUpdate(
//         { _id, addedBy: context.user._id },
//         { restaurantName, foodType, website, location, rating },
//         { new: true },
//       );
//       if (!restaurant) {
//         throw new GraphQLError("Restaurant not found or not yours.");
//       }
//       return restaurant;
//     },
//     deleteRestaurant: async (_parent, { _id }, context) => {
//       if (!context.user) {
//         throw new GraphQLError("Not logged in");
//       }
//       const deleted = await Restaurant.findOneAndDelete({
//         _id,
//         addedBy: context.user._id,
//       });
//       return !!deleted; // return true if deletion occurred, false otherwise
//     },

//     // New: Favorites
//     addFavorite: async (_parent, { restaurantId }, context) => {
//       if (!context.user) {
//         throw new GraphQLError("Not logged in");
//       }

//       // Check if the restaurant exists
//       const restaurant = await Restaurant.findById(restaurantId);
//       if (!restaurant) {
//         throw new GraphQLError("Restaurant not found");
//       }

//       // Check if the favorite already exists
//       let favorite = await Favorite.findOne({
//         user: context.user._id,
//         restaurant: restaurantId,
//       });
//       if (favorite) {
//         throw new GraphQLError("Restaurant is already in favorites");
//       }

//       // Create and save
//       favorite = new Favorite({
//         user: context.user._id,
//         restaurant: restaurantId,
//       });
//       await favorite.save();

//       // Also push to user.favorites array
//       await User.findByIdAndUpdate(context.user._id, {
//         $push: { favorites: restaurantId },
//       });

//       return favorite.populate(["user", "restaurant"]);
//     },

//     removeFavorite: async (_parent, { favoriteId }, context) => {
//       if (!context.user) {
//         throw new GraphQLError("Not logged in");
//       }

//       const favorite = await Favorite.findOne({
//         _id: favoriteId,
//         user: context.user._id,
//       });
//       if (!favorite) {
//         throw new GraphQLError("Favorite not found or not yours");
//       }

//       // Remove from user.favorites
//       await User.findByIdAndUpdate(context.user._id, {
//         $pull: { favorites: favorite.restaurant },
//       });

//       // Delete the Favorite document
//       await Favorite.findByIdAndDelete(favoriteId);
//       return true;
//     },
//   },

//   // Optional: field-level resolvers to populate nested fields
//   User: {
//     // Expand on the "favorites" field so that it returns an array of Restaurants, for example
//     favorites: async (parent) => {
//       // parent.favorites is an array of restaurant IDs
//       return Restaurant.find({ _id: { $in: parent.favorites } });
//     },
//   },
// };
