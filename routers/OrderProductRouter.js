import { Router } from "express";
import OrderProductController from "../controllers/OrderProductController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const orderProductRouter = new Router();

//может быть вообще убрать их из эндпоинтов
// добавить query personId

orderProductRouter.post('', OrderProductController.create);
orderProductRouter.get('', authAdminMiddleWare, OrderProductController.getAll);
orderProductRouter.get('/byOrderId/:id', OrderProductController.getAllByOrderId);
orderProductRouter.get('/:id', OrderProductController.getOne);
orderProductRouter.put('/', OrderProductController.update);
orderProductRouter.delete('/:id', OrderProductController.delete);

export default orderProductRouter;