import { Router } from "express";
import PersonController from "../controllers/PersonController.js";
import { body } from "express-validator";

import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const personRouter = new Router();

personRouter.post('', authAdminMiddleWare, PersonController.create);
personRouter.post('/empty', PersonController.createEmpty);

personRouter.post('/registration',
  // body('email').isEmail(),
  // body('password').isLength({ min: 8, max: 32 }),
  // body('phoneNumber').isLength({ min: 10, max: 11 }),
  PersonController.registration
);
personRouter.post('/login', PersonController.login);
personRouter.post('/logout', PersonController.logout);
personRouter.get('/auth', PersonController.auth);


personRouter.get('', authAdminMiddleWare, PersonController.getAll);
personRouter.get('/:id', authPersonMiddleWare, PersonController.getOne);
personRouter.get('/activate/:link', PersonController.activate);
// refresh authPersonMiddleWare?
personRouter.post('/refresh', PersonController.refresh);
personRouter.put('/', authPersonMiddleWare, PersonController.update);
personRouter.delete('/:id', authPersonMiddleWare, PersonController.delete);

export default personRouter;