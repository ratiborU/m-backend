import { Router } from "express";
import OrderController from "../controllers/OrderController.js";

const orderRouter = new Router();

orderRouter.post('', OrderController.create);
orderRouter.get('', OrderController.getAll);
orderRouter.get('/:id', OrderController.getOne);
orderRouter.put('/', OrderController.update);
orderRouter.delete('/:id', OrderController.delete);

export default orderRouter;