import { Router } from "express";
import OrderController from "../controllers/OrderController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const orderRouter = new Router();

// Любой ли может создавать заказ или только зарегестрированный?
// обновление пользователя при заказе если он был пустым
orderRouter.post('', OrderController.create);
orderRouter.get('', authAdminMiddleWare, OrderController.getAll);
orderRouter.get('/:id', authPersonMiddleWare, OrderController.getOne);
orderRouter.get('/byPersonId/:id', authPersonMiddleWare, OrderController.getAllByPersonId);
orderRouter.put('/', authPersonMiddleWare, OrderController.update);
orderRouter.delete('/:id', authAdminMiddleWare, OrderController.delete);

export default orderRouter;