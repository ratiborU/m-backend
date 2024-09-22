import ApiError from "../error/ApiError.js";
import { FavoriteProduct } from "../models/models.js";

class FavoriteProductService {
    async create(params) {
        const {productId, personId} = params;
        const product = await FavoriteProduct.findOne({where: {productId, personId}});
        if (product) {
            throw ApiError.badRequest('Товар уже давблен в избранное данного пользователя');
        }
        const favoriteProduct = await FavoriteProduct.create({productId, personId});
        return favoriteProduct;
    }

    async getAll(limit, page) {
        page = page || 1;
        limit = limit || 16;
        const offset = (page - 1) * limit;
        const favoriteProducts = await FavoriteProduct.findAndCountAll({limit, offset});
        return favoriteProducts;
    }

    async getAllByPersonId(limit, page, personId) {
        page = page || 1;
        limit = limit || 16;
        const offset = (page - 1) * limit;
        const favoriteProducts = await FavoriteProduct.findAndCountAll(
            {where: {personId}},
            {limit, offset}            
        );
        return favoriteProducts;
    }

    async getOne(id) {
        const favoriteProduct = await FavoriteProduct.findByPk(id);
        // если не нашел выкинуть ошибку
        return favoriteProduct;
    }

    async update(params) {
        const {id, productId, personId} = params;
        await FavoriteProduct.update(
            {productId, personId}, 
            {where: { id }}
        );
        const updatedFavoriteProduct = await FavoriteProduct.findByPk(id)
        return updatedFavoriteProduct;
    }

    async delete(id) {
        const favoriteProduct = await FavoriteProduct.findByPk(id)
        await FavoriteProduct.destroy({where: { id }});
        return favoriteProduct;
    }
}

export default new FavoriteProductService;