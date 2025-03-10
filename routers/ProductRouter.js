import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const productRouter = new Router();
productRouter.post('', checkRoleMiddleWare('ADMIN'), authMiddleWare, ProductController.create);
productRouter.get('', ProductController.getAll);
productRouter.get('/:id', ProductController.getOne);
productRouter.put('/:id', ProductController.update);
// productRouter.put('', () => { console.log('update'); });
productRouter.delete('/:id', checkRoleMiddleWare('ADMIN'), ProductController.delete);

export default productRouter;