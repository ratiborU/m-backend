import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { authAdminMiddleWare } from "../middleware/authAdminMiddleware.js";
import { authPersonMiddleWare } from "../middleware/authPersonMiddleWare.js";
import ProductHistoryController from "../controllers/ProductHistoryController.js";

const productHistoryRouter = new Router();

productHistoryRouter.post('', ProductHistoryController.create);
productHistoryRouter.get('', authAdminMiddleWare, ProductHistoryController.getAll);
productHistoryRouter.get('/byPersonId/:id', ProductHistoryController.getAllByPersonId);
productHistoryRouter.get('/:id', ProductHistoryController.getOne);
productHistoryRouter.put('/', ProductHistoryController.update);
productHistoryRouter.delete('/:id', authAdminMiddleWare, ProductHistoryController.delete);

export default productHistoryRouter;