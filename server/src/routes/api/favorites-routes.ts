import { Router } from "express";
import { addFavorite } from "../../controllers/favorites-controller";

const router = Router();

// Route to add a restaurant to favorites
router.post("/add", addFavorite);

export { router as favoritesRouter };
