import { Router } from "express";
import CommentController from "../controllers/CommentController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const commentRouter = new Router();
// изменять и создавать только свои комментарии
commentRouter.post('', authMiddleWare, CommentController.create);
commentRouter.get('', authAdminMiddleWare, CommentController.getAll);
commentRouter.get('/:id', CommentController.getOne);
commentRouter.get('/byProductId/:id', CommentController.getAllByProductId);
commentRouter.get('/byPersonId/:id', authPersonMiddleWare, CommentController.getAllByPersonId);
// commentRouter.get('/byPersonId/:id', CommentController.getAllByPersonId);
// query
commentRouter.get('/byPersonAndProductId/:id', CommentController.getOneByPersonAndProductId);
commentRouter.put('/', authPersonMiddleWare, CommentController.update);
// query ?
commentRouter.delete('/:id', CommentController.delete);

export default commentRouter;