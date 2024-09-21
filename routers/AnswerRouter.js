import { Router } from "express";
import AnswerController from "../controllers/AnswerController.js";

const answerRouter = new Router();

answerRouter.post('', AnswerController.create);
answerRouter.get('', AnswerController.getAll);
answerRouter.get('/:id', AnswerController.getOne);
answerRouter.put('/', AnswerController.update);
answerRouter.delete('/:id', AnswerController.delete);

export default answerRouter;