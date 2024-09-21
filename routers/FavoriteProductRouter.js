import { Router } from "express";
import FavoriteProductController from "../controllers/FavoriteProductController.js";

const favoriteProductRouter = new Router();

favoriteProductRouter.post('', FavoriteProductController.create);
favoriteProductRouter.get('', FavoriteProductController.getAll);
favoriteProductRouter.get('/:id', FavoriteProductController.getOne);
favoriteProductRouter.put('/', FavoriteProductController.update);
favoriteProductRouter.delete('/:id', FavoriteProductController.delete);

export default favoriteProductRouter;