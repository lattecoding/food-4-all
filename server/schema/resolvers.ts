import User, { IUser } from './models/User.ts'; // Import IUser for type safety
import Restaurant from './models/Restaurants.ts'; // Assuming you have a Restaurant model
import { UserDocument } from './models/User.ts'; // Assuming this type is exported
import { generateToken } from './utils/token'; // Import your token generation function

interface Context {
  user: UserDocument | null;
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id).populate('favorites.restaurant');
        return userData;
      }
      throw new Error('User not authenticated');
    },
    getRestaurant: async (_parent: unknown, { id }: { id: string }) => {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      return restaurant;
    },
    getRestaurants: async () => {
      return await Restaurant.find(); // Fetch all restaurants
    },
  },

  Mutation: {
    addFavorite: async (_parent: unknown, { input }: { input: { restaurantId: string } }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { favorites: { restaurant: input.restaurantId } } },
          { new: true, runValidators: true }
        ).populate('favorites.restaurant');
        return updatedUser;
      }
      throw new Error('User not authenticated');
    },

    deleteFavorite: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { favorites: { restaurant: id } } },
          { new: true }
        ).populate('favorites.restaurant');
        return updatedUser;
      }
      throw new Error('User not authenticated');
    },

    addUser: async (_parent: unknown, { input }: { input: { username: string; password: string } }) => {
      const newUser = await User.create(input);
      return { token: generateToken(newUser), user: newUser }; // Assuming you have a `generateToken` function
    },

    login: async (_parent: unknown, { username, password }: { username: string; password: string }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isValid = await user.isCorrectPassword(password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }
      return { token: generateToken(user), user }; // Assuming you have a `generateToken` function
    },

    addRestaurant: async (_parent: unknown, { restaurantName, foodType, website, location, rating }: { restaurantName: string; foodType: string; website?: string; location: string; rating: number }, context: Context) => {
      if (!context.user) {
        throw new Error('User not authenticated');
      }
      const newRestaurant = await Restaurant.create({
        restaurantName,
        foodType,
        website,
        location,
        rating,
        addedBy: context.user._id, // Link the restaurant to the user
      });
      return newRestaurant;
    },

    updateRestaurant: async (_parent: unknown, { id, restaurantName, foodType, website, location, rating }: { id: string; restaurantName?: string; foodType?: string; website?: string; location?: string; rating?: number }) => {
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        id,
        { restaurantName, foodType, website, location, rating },
        { new: true, runValidators: true }
      );
      if (!updatedRestaurant) {
        throw new Error('Restaurant not found');
      }
      return updatedRestaurant;
    },

    deleteRestaurant: async (_parent: unknown, { id }: { id: string }) => {
      const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
      if (!deletedRestaurant) {
        throw new Error('Restaurant not found');
      }
      return deletedRestaurant;
    },
  },
};

export default resolvers;