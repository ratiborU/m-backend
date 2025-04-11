import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";
import CouponController from "../controllers/CouponController.js";

const couponRouter = new Router();

couponRouter.post('', authAdminMiddleWare, CouponController.create);
couponRouter.get('', authAdminMiddleWare, CouponController.getAll);
// couponRouter.get('/:id', CouponController.getOne);
couponRouter.get('/check/', CouponController.check);
couponRouter.put('/', authAdminMiddleWare, CouponController.update);
couponRouter.delete('/:id', authAdminMiddleWare, CouponController.delete);

export default couponRouter;