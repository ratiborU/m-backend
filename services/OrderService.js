import { Order, Person, OrderProduct, Product } from "../models/models.js";
import { BasketProduct } from "../models/models.js";
import OrderProductService from "./OrderProductService.js";
import { UsedCoupon } from "../models/models.js";
import MailService from "./MailService.js";

class OrderService {
  async create(params) {
    // возжможно стоит добавить строку с перечислением всех товаров в модель Order
    // не удаляя при этом OrderProduct
    // может быть стоит отправлять уведомление на почту 
    // о том что пришел заказ
    // не знаю где прикручивать оплату здесь или на сервере

    // выкидывать ошибку если товары не найдены лучше в orderProductService
    const {
      price,
      address,
      comment,
      status,
      delivery,
      deliveryDays,
      personId,
      couponId
    } = params;

    const order = await Order.create({ price, address, comment, status, delivery, deliveryDays, personId });
    await OrderProductService.createFromPersonBasket(personId, order.dataValues.id);
    if (!!couponId) {
      await UsedCoupon.create({ couponId, personId })
    }
    return order;
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 1000;
    let offset = (page - 1) * limit;
    const orders = await Order.findAndCountAll({ limit, offset, include: Person });
    // const orders = await Order.findAll();
    return orders;
  }

  async getOne(id) {
    const order = await Order.findByPk(id, {
      include: [
        { model: Person },
        { model: OrderProduct, include: Product }
      ]
    });
    return order;
  }

  async getAllByPersonId(personId) {
    const orders = await Order.findAll({
      where: { personId }, include: [
        { model: Person },
        { model: OrderProduct, include: Product }
      ],
      order: [['id', 'DESC']],
    });
    return orders;
  }

  async update(params) {
    const { id, price, address, comment, status, delivery, deliveryDays, personId } = params;
    const order = await Order.findByPk(id);
    await Order.update({
      price: price || order.dataValues.price,
      address: address || order.dataValues.address,
      comment: comment || order.dataValues.comment,
      status: status || order.dataValues.status,
      delivery: delivery || order.dataValues.delivery,
      deliveryDays: deliveryDays || order.dataValues.deliveryDays,
      personId: personId || order.dataValues.personId
    }, {
      where: { id }
    }
    );
    const person = await Person.findByPk(personId);
    console.log(person.dataValues.email);
    if (person && order.dataValues.status != status && status != '') {
      MailService.sendStatusInfo(person.dataValues.email, status);
    }

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