import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const productRouter = new Router();

// productRouter.post('', checkRoleMiddleWare('ADMIN'), ProductController.create);
// productRouter.get('', checkRoleMiddleWare('ADMIN'), ProductController.getAll);
// productRouter.get('/:id', ProductController.getOne);
// productRouter.put('/', checkRoleMiddleWare('ADMIN'), ProductController.update);
// productRouter.delete('/:id', checkRoleMiddleWare('ADMIN'), ProductController.delete);

productRouter.post('', ProductController.create);
productRouter.get('', ProductController.getAll);
productRouter.get('/:id', ProductController.getOne);
productRouter.put('/', ProductController.update);
productRouter.delete('/:id', ProductController.delete);

export default productRouter;