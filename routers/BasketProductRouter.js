import { Router } from "express";
import BasketProductController from "../controllers/BasketProductController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const basketProductRouter = new Router();

basketProductRouter.post('', BasketProductController.create);
basketProductRouter.get('', authAdminMiddleWare, BasketProductController.getAll);
basketProductRouter.get('/byPersonId/:id', authPersonMiddleWare, BasketProductController.getAllByPersonId);
// query?
basketProductRouter.get('/:id', BasketProductController.getOne);
basketProductRouter.put('/', authPersonMiddleWare, BasketProductController.update);
// query?
basketProductRouter.delete('/:id', BasketProductController.delete);

export default basketProductRouter;