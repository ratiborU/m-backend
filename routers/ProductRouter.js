import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const productRouter = new Router();

productRouter.post('', checkRoleMiddleWare('ADMIN'), ProductController.create);
productRouter.get('', checkRoleMiddleWare('ADMIN'), ProductController.getAll);
productRouter.get('/:id', ProductController.getOne);
productRouter.put('/', checkRoleMiddleWare('ADMIN'), ProductController.update);
productRouter.delete('/:id', checkRoleMiddleWare('ADMIN'), ProductController.delete);

export default productRouter;