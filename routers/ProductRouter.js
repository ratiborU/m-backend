import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const productRouter = new Router();

productRouter.post('', checkRoleMiddleWare('ADMIN'), ProductController.create);
productRouter.get('', ProductController.getAll);
productRouter.get('/:id', ProductController.getOne);
productRouter.put('/', checkRoleMiddleWare('ADMIN'), ProductController.update);
// возможно нужно вынести эти два в сервис
productRouter.patch('/addRate/', checkRoleMiddleWare('ADMIN'), ProductController.addRate); 
productRouter.patch('/removeRate/', checkRoleMiddleWare('ADMIN'), ProductController.removeRate);
productRouter.delete('/:id', checkRoleMiddleWare('ADMIN'), ProductController.delete);

export default productRouter;