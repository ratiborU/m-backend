import { Router } from "express";
import FavoriteProductController from "../controllers/FavoriteProductController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const favoriteProductRouter = new Router();

favoriteProductRouter.post('', FavoriteProductController.create);
favoriteProductRouter.get('', FavoriteProductController.getAll);
favoriteProductRouter.get('/byPersonId/:id', FavoriteProductController.getAllByPersonId);
favoriteProductRouter.get('/:id', FavoriteProductController.getOne);
favoriteProductRouter.put('/', FavoriteProductController.update);
favoriteProductRouter.delete('/:id', FavoriteProductController.delete);
favoriteProductRouter.post('/byPersonAndProductId/', FavoriteProductController.deleteByPersonAndProductId);

export default favoriteProductRouter;