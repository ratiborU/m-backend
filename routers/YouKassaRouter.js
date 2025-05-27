import { Router } from "express";
// import YouKassaController from "../controllers/YouKassaController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";
// import YouKassaController;
import YouKassaController from '../controllers/YouKassaController.js'

const youKassaRouter = new Router();

youKassaRouter.post('', YouKassaController.createPayment);
youKassaRouter.post('/notification', YouKassaController.notification);
// youKassaRouter.post('/updateReserve/', YouKassaController.updateProductsReserve);
// youKassaRouter.get('', YouKassaController.getAll);

export default youKassaRouter;