import { Router } from "express";
import BasketProductController from "../controllers/BasketProductController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const basketProductRouter = new Router();

basketProductRouter.post('', BasketProductController.create);
basketProductRouter.get('', BasketProductController.getAll);
basketProductRouter.get('/byPersonId/:id', BasketProductController.getAll);
basketProductRouter.get('/:id', BasketProductController.getOne);
basketProductRouter.put('/', BasketProductController.update);
basketProductRouter.delete('/:id', BasketProductController.delete);

export default basketProductRouter;