import { Router } from "express";
import AnswerController from "../controllers/AnswerController.js";

const answerRouter = new Router();

answerRouter.post('', AnswerController.create);
answerRouter.get('', AnswerController.getAll);
answerRouter.get('/byCommentId/:id', AnswerController.getAllByCommentId);
answerRouter.get('/byPersonId/:id', AnswerController.getAllByPersonId);
answerRouter.get('/:id', AnswerController.getOne);
answerRouter.put('/', AnswerController.update);
answerRouter.delete('/:id', AnswerController.delete);

export default answerRouter;