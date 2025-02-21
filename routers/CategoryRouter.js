import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const categoryRouter = new Router();

categoryRouter.post('', checkRoleMiddleWare('ADMIN'), CategoryController.create);
categoryRouter.get('', CategoryController.getAll);
categoryRouter.get('/:id', CategoryController.getOne);
categoryRouter.put('/', checkRoleMiddleWare('ADMIN'), CategoryController.update);
categoryRouter.delete('/:id', checkRoleMiddleWare('ADMIN'), CategoryController.delete);

export default categoryRouter;