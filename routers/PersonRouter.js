import { Router } from "express";
import PersonController from "../controllers/PersonController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const personRouter = new Router();

personRouter.post('/registration', PersonController.registration);
personRouter.post('/login', PersonController.login);
personRouter.get('/auth', authMiddleWare, PersonController.auth);
personRouter.get('', PersonController.getAll);
personRouter.get('/:id', PersonController.getOne);
personRouter.put('/', PersonController.update);
personRouter.delete('/:id', PersonController.delete);

export default personRouter;