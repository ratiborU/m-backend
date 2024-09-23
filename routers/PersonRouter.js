import { Router } from "express";
import PersonController from "../controllers/PersonController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const personRouter = new Router();

personRouter.post('/registration', 
    body('email').isEmail(), 
    body('password').isLength({min: 8, max: 32}), 
    PersonController.registration
);
personRouter.post('/login', PersonController.login);
personRouter.post('/logout', PersonController.logout);

personRouter.get('/auth', authMiddleWare, PersonController.auth);
personRouter.get('', PersonController.getAll);
personRouter.get('/:id', PersonController.getOne);
personRouter.get('/activate/:link', PersonController.activate);
personRouter.post('/refresh', PersonController.refresh);

personRouter.put('/', PersonController.update);
personRouter.delete('/:id', PersonController.delete);

export default personRouter;