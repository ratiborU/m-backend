import { Router } from "express";
import OrderController from "../controllers/OrderController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const orderRouter = new Router();

orderRouter.post('', OrderController.create);
orderRouter.get('', OrderController.getAll);
orderRouter.get('/:id', OrderController.getOne);
orderRouter.get('/byPersonId/:id', OrderController.getAllByPersonId);
orderRouter.put('/', OrderController.update);
orderRouter.delete('/:id', OrderController.delete);

export default orderRouter;