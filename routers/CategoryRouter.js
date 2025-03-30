import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const categoryRouter = new Router();

categoryRouter.post('', authAdminMiddleWare, CategoryController.create);
categoryRouter.get('', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getOne);
categoryRouter.put('/', authAdminMiddleWare, CategoryController.update);
categoryRouter.delete('/:id', authAdminMiddleWare, CategoryController.delete);

export default categoryRouter;