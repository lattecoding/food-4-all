import dotenv from "dotenv";
dotenv.config();

import express, { Request } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { GraphQLFormattedError } from 'graphql';
import db from "./config/connection.js";
import typeDefs from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";

interface MyContext {
  user?: {
    _id: string;
    username: string;
  };
}

const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Apollo Server
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  formatError: (formattedError: GraphQLFormattedError) => {
    console.error('GraphQL Error:', formattedError);
    return formattedError;
  },
});

// Self-invoking async function to initialize the server
(async () => {
  try {
    await db();
    console.log("✅ Database connected successfully.");

    await server.start();
    
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }: { req: Request }) => {
          return { user: (req as any).user };
        },
      })
    );

    app.listen(PORT, () => {
      console.log(`🚀 API server running on port ${PORT}`);
      console.log(`🌐 GraphQL Playground available at http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error("❌ Server initialization error:", err);
    process.exit(1);
  }
})();
