import { Router } from "express";
import { userRouter } from "./user-routes.js";
import { favoritesRouter } from "./favorites-routes.js";

const router = Router();

router.use("/users", userRouter);
router.use("/favorites", favoritesRouter);

export default router;
