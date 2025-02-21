import { Router } from "express";
import OrderProductController from "../controllers/OrderProductController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const orderProductRouter = new Router();

orderProductRouter.post('', OrderProductController.create);
orderProductRouter.get('', OrderProductController.getAll);
orderProductRouter.get('/byOrderId/:id', OrderProductController.getAllByOrderId);
orderProductRouter.get('/:id', OrderProductController.getOne);
orderProductRouter.put('/', OrderProductController.update);
orderProductRouter.delete('/:id', OrderProductController.delete);

export default orderProductRouter;