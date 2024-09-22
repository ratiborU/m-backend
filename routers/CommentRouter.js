import { Router } from "express";
import CommentController from "../controllers/CommentController.js";

const commentRouter = new Router();

commentRouter.post('', CommentController.create);
commentRouter.get('', CommentController.getAll);
commentRouter.get('/:id', CommentController.getOne);
commentRouter.get('/byProductId/:id', CommentController.getAllByProductId);
commentRouter.get('/byPersonId/:id', CommentController.getAllByPersonId);
commentRouter.put('/', CommentController.update);
commentRouter.delete('/:id', CommentController.delete);

export default commentRouter;