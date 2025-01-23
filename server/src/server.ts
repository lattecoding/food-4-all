import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { authMiddleware } from "./utils/auth.js"; // Authentication middleware
import db from "./config/connection.js";
import typeDefs from "./schema/typeDefs.js";
import resolvers from "./schema/resolvers.js";

// Self-invoking async function to initialize the server
(async () => {
  try {
    // Connect to the database
    await db();
    console.log("✅ Database connected successfully.");
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
    process.exit(1); // Exit with an error code if DB connection fails
  }

  const PORT = process.env.PORT || 3001;
  const app = express();

  // Express middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => authMiddleware({ req }), // Pass user authentication context
  });

  // Start Apollo Server and apply middleware to Express
  await server.start();
  server.applyMiddleware({ app });

  // Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}`);
    console.log(
      `🌐 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
