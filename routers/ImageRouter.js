import { Router } from "express";
import ImageController from "../controllers/ImageController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const imageRouter = new Router();

imageRouter.post('', authAdminMiddleWare, ImageController.create);
imageRouter.get('', authAdminMiddleWare, ImageController.getAll);
imageRouter.get('/getAllByProductId/:id', ImageController.getAllByProductId);
imageRouter.get('/:id', ImageController.getOne);
imageRouter.put('/', authAdminMiddleWare, ImageController.update);
imageRouter.delete('/:id', authAdminMiddleWare, ImageController.delete);

export default imageRouter;