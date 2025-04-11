import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";
import UsedCouponController from "../controllers/UsedCouponController.js";

const usedCouponRouter = new Router();

usedCouponRouter.post('', authAdminMiddleWare, UsedCouponController.create);
usedCouponRouter.get('', authAdminMiddleWare, UsedCouponController.getAll);
usedCouponRouter.get('/:id', UsedCouponController.getOne);
usedCouponRouter.put('/', authAdminMiddleWare, UsedCouponController.update);
usedCouponRouter.delete('/:id', authAdminMiddleWare, UsedCouponController.delete);

export default usedCouponRouter;