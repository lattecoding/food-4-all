const typeDefs = `#graphql
  type User {
    _id: ID!
    username: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User]
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
  }
`;

export default typeDefs; 