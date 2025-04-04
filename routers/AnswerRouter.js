import { Router } from "express";
import AnswerController from "../controllers/AnswerController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const answerRouter = new Router();

answerRouter.post('', authAdminMiddleWare, AnswerController.create);
answerRouter.get('', authAdminMiddleWare, AnswerController.getAll);
answerRouter.get('/byCommentId/:id', AnswerController.getAllByCommentId);
answerRouter.get('/byPersonId/:id', AnswerController.getAllByPersonId);
answerRouter.get('/:id', AnswerController.getOne);
answerRouter.put('/', authAdminMiddleWare, AnswerController.update);
answerRouter.delete('/:id', authAdminMiddleWare, AnswerController.delete);

export default answerRouter;