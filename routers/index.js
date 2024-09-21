import { Router } from "express";
import answerRouter from "./AnswerRouter.js";
import basketProductRouter from "./BasketProductRouter.js";
import commentRouter from "./CommentRouter.js";
import favoriteProductRouter from "./FavoriteProductRouter.js";
import imageRouter from "./ImageRouter.js";
import orderProductRouter from "./OrderProductRouter.js";
import orderRouter from "./OrderRouter.js";
import personRouter from "./PersonRouter.js";
import productRouter from "./ProductRouter.js";

const router = new Router();

router.use('/answers', answerRouter);
router.use('/basketProducts', basketProductRouter);
router.use('/comments', commentRouter);
router.use('/favoriteProducts', favoriteProductRouter);
router.use('/images', imageRouter);
router.use('/orderProducts', orderProductRouter);
router.use('/orders', orderRouter);
router.use('/persons', personRouter);
router.use('/products', productRouter);

export { router };