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