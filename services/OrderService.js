import { Order, Person } from "../models/models.js";
import { BasketProduct } from "../models/models.js";
import OrderProductService from "./OrderProductService.js";

class OrderService {
  async create(params) {
    // возжможно стоит добавить строку с перечислением всех товаров в модель Order
    // не удаляя при этом OrderProduct
    // может быть стоит отправлять уведомление на почту 
    // о том что пришел заказ
    // не знаю где прикручивать оплату здесь или на сервере

    // выкидывать ошибку если товары не найдены лучше в orderProductService
    const { price, address, comment, status, delivery, deliveryDays, personId } = params;
    const order = await Order.create({ price, address, comment, status, delivery, deliveryDays, personId });
    await OrderProductService.createFromPersonBasket(personId, order.dataValues.id);
    return order;
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 100;
    let offset = (page - 1) * limit;
    const orders = await Order.findAndCountAll({ limit, offset, include: Person });
    // const orders = await Order.findAll();
    return orders;
  }

  async getOne(id) {
    const order = await Order.findByPk(id, { include: Person });
    return order;
  }

  async getAllByPersonId(personId) {
    const orders = await Order.findAll({ where: { personId }, include: Person });
    return orders;
  }

  async update(params) {
    const { id, price, address, comment, status, delivery, deliveryDays, personId } = params;
    await Order.update(
      { price, address, comment, status, delivery, deliveryDays, personId },
      { where: { id } }
    );
    const updatedOrder = await Order.findByPk(id);
    return updatedOrder;
  }

  // очень опасная функция
  async delete(id) {
    const order = await Order.findByPk(id);
    await Order.destroy({ where: { id } })
    return order;
  }
}

export default new OrderService;