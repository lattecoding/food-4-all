import { gql } from 'graphql-tag';

// Define the GraphQL schema using gql
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    password: String!  // Consider removing this if you don't want to expose passwords
    favorites: [Favorite]
    createdAt: String
    updatedAt: String
  }

  type Favorite {
    restaurant: Restaurant!
  }

  type Restaurant {
    _id: ID!
    restaurantName: String!
    foodType: String
    website: String
    location: String
    rating: Int
    addedBy: User  // Reference to the User who added the restaurant
    createdAt: String
    updatedAt: String
  }

  type Auth {
    token: String!
    user: User!
  }

  input AddFavoriteInput {
    restaurantId: ID!
  }

  input AddUserInput {
    username: String!
    password: String!
  }

  type Query {
    me: User
    getRestaurant(id: ID!): Restaurant
    getRestaurants: [Restaurant]  // Fetch all restaurants
    getUsers: [User]  // Fetch all users
  }

  type Mutation {
    addFavorite(input: AddFavoriteInput!): User
    deleteFavorite(id: ID!): User
    addUser(input: AddUserInput!): Auth
    login(username: String!, password: String!): Auth
    addRestaurant(
      restaurantName: String!,
      foodType: String,
      website: String,
      location: String!,
      rating: Int!
    ): Restaurant
    updateRestaurant(
      id: ID!,
      restaurantName: String,
      foodType: String,
      website: String,
      location: String,
      rating: Int
    ): Restaurant
    deleteRestaurant(id: ID!): Restaurant
  }
`;

export default typeDefs;