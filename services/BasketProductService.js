import { BasketProduct } from "../models/models.js";
import ApiError from '../error/ApiError.js'

class BasketProductService {
    async create(params) {
        const {productId, personId} = params;
        const product = await BasketProduct.findOne({where: {productId, personId}});
        if (product) {
            throw ApiError.badRequest('Товар уже давблен в корзину данного пользователя');
        }
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
            {where: {personId}},
            {limit, offset}
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
            {count, inOrder}, 
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