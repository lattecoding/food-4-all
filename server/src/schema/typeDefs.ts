const typeDefs = `#graphql
  type User {
    _id: ID!
    username: String!
    favorites: [Restaurant!]!   # or [Favorite!]! depending on how you want to expose it
  }

  type Restaurant {
    _id: ID!
    restaurantName: String!
    foodType: String!
    website: String
    location: String!
    rating: Float!
    addedBy: User!
  }

  type Favorite {
    _id: ID!
    user: User!
    restaurant: Restaurant!
  }

  type Auth {
    token: String!
    user: User!
  }

  # Queries
  type Query {
    # Existing queries
    me: User            # Already have
    users: [User]       # Already have

    # Additional queries
    user(_id: ID!): User
    restaurants: [Restaurant]
    restaurant(_id: ID!): Restaurant
    favorites: [Favorite]
    favorite(_id: ID!): Favorite
  }

  # Mutations
  type Mutation {
    # Existing mutations
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth

    # Additional mutations
    addRestaurant(
      restaurantName: String!
      foodType: String!
      website: String
      location: String!
      rating: Float!
    ): Restaurant

    updateRestaurant(
      _id: ID!
      restaurantName: String
      foodType: String
      website: String
      location: String
      rating: Float
    ): Restaurant

    deleteRestaurant(_id: ID!): Boolean

    addFavorite(restaurantId: ID!): Favorite
    removeFavorite(favoriteId: ID!): Boolean
    # or removeFavorite(restaurantId: ID!) if you prefer
  }
`;

export default typeDefs;
