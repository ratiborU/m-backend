import { OrderProduct, BasketProduct, Product, Order, Category } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class OrderProductService {
  async create(params) {
    const { productId, orderId, count } = params;
    const product = await OrderProduct.findOne({ where: { orderId, productId } });
    if (product) {
      throw ApiError.badRequest('Товар уже добавлен в этот заказ');
    }
    const orderProduct = await OrderProduct.create({ productId, orderId, count });
    return orderProduct;
  }

  async createFromPersonBasket(personId, orderId) {
    const basketProducts = await BasketProduct.findAll({ where: { personId, inOrder: true } });
    const orderProducts = basketProducts.map(x => x.dataValues);

    for (const product of orderProducts) {
      const { id, productId, count } = product
      await BasketProduct.destroy({ where: { id } });
      await this.create({ productId, orderId, count });
    }
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 1000;
    const offset = (page - 1) * limit;
    const orderProducts = await OrderProduct.findAndCountAll({ limit, offset, include: { model: Product, include: Category } });
    return orderProducts;
  }
  async getAllByOrderId(limit, page, orderId) {
    page = page || 1;
    limit = limit || 1000;
    const offset = (page - 1) * limit;
    const orderProducts = await OrderProduct.findAndCountAll(
      { where: { orderId }, limit, offset, include: { model: Product, include: Category } }
    );
    return orderProducts;
  }

  async getOne(id) {
    const orderProduct = await OrderProduct.findByPk(id, { include: { model: Product, include: Category } });
    // если не нашел выкинуть ошибку
    return orderProduct;
  }

  async update(params) {
    const { id, count } = params;
    await OrderProduct.update(
      { count },
      { where: { id } }
    );
    const updatedOrderProduct = await OrderProduct.findByPk(id, { include: { model: Product, include: Category } })
    return updatedOrderProduct;
  }

  async delete(id) {
    const orderProduct = await OrderProduct.findByPk(id)
    await OrderProduct.destroy({ where: { id } });
    return orderProduct;
  }
}

export default new OrderProductService;