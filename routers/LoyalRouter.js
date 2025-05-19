import { Router } from "express";
import LoyalController from "../controllers/LoyalController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const loyalRouter = new Router();

loyalRouter.post('', authAdminMiddleWare, LoyalController.create);
loyalRouter.get('', authAdminMiddleWare, LoyalController.getAll);
loyalRouter.get('/byId/:id', authPersonMiddleWare, LoyalController.getOne);
loyalRouter.get('/byPersonId/:id', authPersonMiddleWare, LoyalController.getOneByPersonId);
loyalRouter.put('/', LoyalController.update);
loyalRouter.delete('/:id', authAdminMiddleWare, LoyalController.delete);

export default loyalRouter;