import { Router } from "express";
import FavoriteProductController from "../controllers/FavoriteProductController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const favoriteProductRouter = new Router();

favoriteProductRouter.post('', FavoriteProductController.create);
favoriteProductRouter.get('', authAdminMiddleWare, FavoriteProductController.getAll);
favoriteProductRouter.get('/byPersonId/:id', authPersonMiddleWare, FavoriteProductController.getAllByPersonId);
// query
favoriteProductRouter.get('/:id', FavoriteProductController.getOne);
favoriteProductRouter.put('/', authPersonMiddleWare, FavoriteProductController.update);
// query
favoriteProductRouter.delete('/:id', FavoriteProductController.delete);
// query
favoriteProductRouter.post('/byPersonAndProductId/', FavoriteProductController.deleteByPersonAndProductId);

export default favoriteProductRouter;