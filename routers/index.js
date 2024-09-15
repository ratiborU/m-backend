import { Router } from "express";
import personRouter from "./PersonRouter.js";
import productRouter from "./ProductRouter.js";
import imageRouter from "./ImageRouter.js";

const router = new Router();

router.use('/persons', personRouter);
router.use('/products', productRouter);
router.use('/images', imageRouter);

export { router };