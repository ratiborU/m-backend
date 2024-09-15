import { Router } from "express";
import ImageController from "../controllers/ImageController.js";

const imageRouter = new Router();

imageRouter.post('', ImageController.create);
imageRouter.get('', ImageController.getAll);
imageRouter.get('/getAllByProductId/:id', ImageController.getAllByProductId);
imageRouter.get('/:id', ImageController.getOne);
imageRouter.put('/', ImageController.update);
imageRouter.delete('/:id', ImageController.delete);

export default imageRouter;