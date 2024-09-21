import { Router } from "express";
import OrderProductController from "../controllers/OrderProductController.js";

const orderProductRouter = new Router();

orderProductRouter.post('', OrderProductController.create);
orderProductRouter.get('', OrderProductController.getAll);
orderProductRouter.get('/:id', OrderProductController.getOne);
orderProductRouter.put('/', OrderProductController.update);
orderProductRouter.delete('/:id', OrderProductController.delete);

export default orderProductRouter;