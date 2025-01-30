import { Router } from "express";
import { addFavorite } from "../../controllers/favorites-controllers.js";

const router = Router();

// Route to add a restaurant to favorites
router.post("/favorites", addFavorite);

export { router as favoritesRouter };
