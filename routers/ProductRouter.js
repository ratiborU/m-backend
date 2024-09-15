import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const productRouter = new Router();

productRouter.post('', checkRoleMiddleWare('ADMIN'), ProductController.create);
productRouter.get('', ProductController.getAll);
productRouter.get('/:id', ProductController.getOne);
productRouter.put('/', ProductController.update);
productRouter.patch('/addRate/', ProductController.addRate);
productRouter.patch('/removeRate/', ProductController.removeRate);
productRouter.delete('/:id', ProductController.delete);

export default productRouter;