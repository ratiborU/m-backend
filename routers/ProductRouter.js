import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const productRouter = new Router();
productRouter.post('', authAdminMiddleWare, authMiddleWare, ProductController.create);
productRouter.get('', ProductController.getAll);
productRouter.get('/:id', ProductController.getOne);
productRouter.put('/:id', authAdminMiddleWare, ProductController.update);
productRouter.delete('/:id', authAdminMiddleWare, ProductController.delete);

export default productRouter;