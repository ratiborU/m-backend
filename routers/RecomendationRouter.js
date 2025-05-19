import { Router } from "express";
import LoyalController from "../controllers/LoyalController.js";
import RecomendationController from "../controllers/RecomendationController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";

const recomendationRouter = new Router();

recomendationRouter.post('', authAdminMiddleWare, RecomendationController.createAll);
recomendationRouter.get('', authAdminMiddleWare, RecomendationController.getAll);
recomendationRouter.get('/:id', RecomendationController.getSimularProductsByProductId);
recomendationRouter.get('/recomendationsByPersonId/:id', RecomendationController.getRecomendationByPersonId);
recomendationRouter.put('/', authAdminMiddleWare, RecomendationController.updateAll);
// recomendationRouter.delete('/:id', authAdminMiddleWare, RecomendationController.delete);
// getRecomendationByPersonId
export default recomendationRouter;