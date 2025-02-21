import { Router } from "express";
import AnswerController from "../controllers/AnswerController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";

const answerRouter = new Router();

answerRouter.post('', checkRoleMiddleWare('ADMIN'), AnswerController.create);
answerRouter.get('', AnswerController.getAll);
answerRouter.get('/byCommentId/:id', AnswerController.getAllByCommentId);
answerRouter.get('/byPersonId/:id', AnswerController.getAllByPersonId);
answerRouter.get('/:id', AnswerController.getOne);
answerRouter.put('/', checkRoleMiddleWare('ADMIN'), AnswerController.update);
answerRouter.delete('/:id', checkRoleMiddleWare('ADMIN'), AnswerController.delete);

export default answerRouter;