import { Router } from "express";
import CommentController from "../controllers/CommentController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const commentRouter = new Router();
// изменять и создавать только свои комментарии
commentRouter.post('', authMiddleWare, CommentController.create);
commentRouter.get('', CommentController.getAll);
commentRouter.get('/:id', CommentController.getOne);
commentRouter.get('/byProductId/:id', CommentController.getAllByProductId);
commentRouter.get('/byPersonId/:id', CommentController.getAllByPersonId);
commentRouter.put('/', authMiddleWare, CommentController.update);
commentRouter.delete('/:id', authMiddleWare, CommentController.delete);

export default commentRouter;