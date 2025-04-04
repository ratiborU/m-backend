import OrderService from "../services/OrderService.js";

class OrderController {
  async create(req, res, next) {
    try {
      const order = await OrderService.create(req.body);
      return res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page } = req.query;
      const orders = await OrderService.getAll(limit, page);
      return res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOne(id);
      return res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getAllByPersonId(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderService.getAllByPersonId(id);
      return res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const order = await OrderService.update(req.body);
      return res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const order = await OrderService.delete(id);
      return res.json(order);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();