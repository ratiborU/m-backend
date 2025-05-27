import { Router } from "express";
// import MoiSkladController from "../controllers/MoiSkladController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";
// import MoiSkladController;
import MoiSkladController from '../controllers/MoiSkaldController.js'

const moiSkladRouter = new Router();

moiSkladRouter.post('', MoiSkladController.createProducts);
moiSkladRouter.post('/updateReserve/', MoiSkladController.updateProductsReserve);
moiSkladRouter.get('', MoiSkladController.getAll);
// moiSkladRouter.get('/byCommentId/:id', MoiSkladController.getAllByCommentId);
// moiSkladRouter.get('/byPersonId/:id', MoiSkladController.getAllByPersonId);
// moiSkladRouter.get('/:id', MoiSkladController.getOne);
// moiSkladRouter.put('/', authAdminMiddleWare, MoiSkladController.update);
// moiSkladRouter.delete('/:id', authAdminMiddleWare, MoiSkladController.delete);

export default moiSkladRouter;