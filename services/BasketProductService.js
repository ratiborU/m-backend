import { BasketProduct } from "../models/models.js";

class BasketProductService {
    async create(params) {
        const {productId, personId} = params;
        const basketProduct = await BasketProduct.create({productId, personId});
        return basketProduct;
    }

    async getAll(limit, page) {
        page = page || 1;
        limit = limit || 16;
        const offset = (page - 1) * limit;
        const basketProducts = await BasketProduct.findAndCountAll({limit, offset});
        return basketProducts;
    }

    async getAllByPersonId(limit, page, personId) {
        page = page || 1;
        limit = limit || 16;
        const offset = (page - 1) * limit;
        const basketProducts = await BasketProduct.findAndCountAll(
            {limit, offset}, 
            {where: {personId}}
        );
        return basketProducts;
    }

    async getOne(id) {
        const basketProduct = await BasketProduct.findByPk(id);
        // если не нашел выкинуть ошибку
        return basketProduct;
    }

    async update(params) {
        const {id, productId, personId, count, inOrder} = params;
        await BasketProduct.update(
            {productId, personId, count, inOrder}, 
            {where: { id }}
        );
        const updatedBasketProduct = await BasketProduct.findByPk(id)
        return updatedBasketProduct;
    }

    async delete(id) {
        const basketProduct = await BasketProduct.findByPk(id)
        await BasketProduct.destroy({where: { id }});
        return basketProduct;
    }
}

export default new BasketProductService;