import { OrderProduct } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class OrderProductService {
    async create(params) {
        const {productId, orderId, count} = params;
        const product = await OrderProduct.findOne({where: {orderId, productId}});
        if (product) {
            throw ApiError.badRequest('Товар уже добавлен в этот заказ');
        }
        const orderProduct = await OrderProduct.create({productId, orderId, count});
        return orderProduct;
    }

    async createFromPersonBasket(personId) {

    }

    async getAll(limit, page) {
        page = page || 1;
        limit = limit || 16;
        const offset = (page - 1) * limit;
        const orderProducts = await OrderProduct.findAndCountAll({limit, offset});
        return orderProducts;
    }
    async getAllByOrderId(limit, page, orderId) {
        page = page || 1;
        limit = limit || 16;
        const offset = (page - 1) * limit;
        const orderProducts = await OrderProduct.findAndCountAll(
            {limit, offset}, 
            {where: {orderId}}
        );
        return orderProducts;
    }

    async getOne(id) {
        const orderProduct = await OrderProduct.findByPk(id);
        // если не нашел выкинуть ошибку
        return orderProduct;
    }

    async update(params) {
        const {id, productId, personId, count, inOrder} = params;
        await OrderProduct.update(
            {productId, personId, count, inOrder}, 
            {where: { id }}
        );
        const updatedOrderProduct = await OrderProduct.findByPk(id)
        return updatedOrderProduct;
    }

    async delete(id) {
        const orderProduct = await OrderProduct.findByPk(id)
        await OrderProduct.destroy({where: { id }});
        return orderProduct;
    }
}

export default new OrderProductService;