import OrderProductService from "../services/OrderProductService.js";

class OrderProductController {
  async create(req, res, next) {
    try {
      const orderProduct = await OrderProductService.create(req.body);
      return res.json(orderProduct);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { limit, page } = req.query;
      const orderProducts = await OrderProductService.getAll(limit, page);
      return res.json(orderProducts);
    } catch (error) {
      next(error);
    }
  }

  async getAllByOrderId(req, res, next) {
    try {
      const { id } = req.params;
      const { limit, page } = req.query;
      const orderProducts = await OrderProductService.getAllByOrderId(limit, page, id);
      return res.json(orderProducts);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const orderProduct = await OrderProductService.getOne(id);
      return res.json(orderProduct);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const orderProduct = await OrderProductService.update(req.body);
      return res.json(orderProduct);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const orderProduct = await OrderProductService.delete(id);
      return res.json(orderProduct);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderProductController();