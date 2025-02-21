import { Router } from "express";
import PersonController from "../controllers/PersonController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { checkRoleMiddleWare } from "../middleware/checkRoleMiddleWare.js";
import { body } from "express-validator";

const personRouter = new Router();

personRouter.post('',
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 32 }),
  PersonController.registration
);

personRouter.post('/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 32 }),
  PersonController.registration
);
personRouter.post('/login', PersonController.login);
personRouter.post('/logout', PersonController.logout);
personRouter.get('/auth', authMiddleWare, PersonController.auth);


personRouter.get('', checkRoleMiddleWare('ADMIN'), authMiddleWare, PersonController.getAll);
// не понятно может возникнуть ошибка
personRouter.get('/:id', checkRoleMiddleWare('ADMIN'), PersonController.getOne);
personRouter.get('/activate/:link', PersonController.activate);
personRouter.post('/refresh', PersonController.refresh);
// обновить может только сам пользователь доделать
personRouter.put('/', checkRoleMiddleWare('PERSON'), PersonController.update);
personRouter.delete('/:id', checkRoleMiddleWare('PERSON'), PersonController.delete);

export default personRouter;