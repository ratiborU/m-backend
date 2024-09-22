import BasketProductService from "../services/BasketProductService.js";

class BasketProductController {
    async create(req, res, next) {
        try {
            const basketProduct = await BasketProductService.create(req.body);
            return res.json(basketProduct);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const { limit, page } = req.query;
            const basketProducts = await BasketProductService.getAll(limit, page);
            return res.json(basketProducts);
        } catch (error) {
            next(error);
        }
    }
    
    async getAllByPersonId(req, res, next) {
        try {
            const {id} = req.params;
            const { limit, page } = req.query;
            const basketProducts = await BasketProductService.getAllByPersonId(limit, page, id);
            return res.json(basketProducts);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const basketProduct = await BasketProductService.getOne(id);
            return res.json(basketProduct);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const basketProduct = await BasketProductService.update(req.body);
            return res.json(basketProduct);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const basketProduct = await BasketProductService.delete(id);
            return res.json(basketProduct);
        } catch (error) {
            next(error);
        }
    }
}

export default new BasketProductController();