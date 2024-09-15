import { Router } from "express";
import AnswerController from "../controllers/AnswerController.js";

const imageRouter = new Router();

imageRouter.post('', AnswerController.create);
imageRouter.get('', AnswerController.getAll);
imageRouter.get('/getAllByCommentId/:id', AnswerController.getAllByCommentId);
imageRouter.get('/:id', AnswerController.getOne);
imageRouter.put('/', AnswerController.update);
imageRouter.delete('/:id', AnswerController.delete);

export default imageRouter;