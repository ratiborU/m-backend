import { Router } from "express";
import ImageController from "../controllers/ImageController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const imageRouter = new Router();

imageRouter.post('', checkRoleMiddleWare('ADMIN'), ImageController.create);
imageRouter.get('', ImageController.getAll);
imageRouter.get('/getAllByProductId/:id', ImageController.getAllByProductId);
imageRouter.get('/:id', ImageController.getOne);
imageRouter.put('/', checkRoleMiddleWare('ADMIN'), ImageController.update);
imageRouter.delete('/:id', checkRoleMiddleWare('ADMIN'), ImageController.delete);

export default imageRouter;