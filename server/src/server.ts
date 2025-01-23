import dotenv from "dotenv";
dotenv.config();

import express from "express";
import routes from "./routes/index.js";
import db from "./config/connection.js";

await db();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
