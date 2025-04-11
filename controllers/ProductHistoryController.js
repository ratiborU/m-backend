// import ProductHistoryService from "../services/ProductHistoryService.js";
import ProductHistoryService from "../services/ProductHistoryService.js";


class ProductHistoryController {
  async create(req, res) {
    try {
      const productHistory = await ProductHistoryService.create(req.body);
      return res.json(productHistory);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req, res) {
    try {
      const productsHistory = await ProductHistoryService.getAll();
      return res.json(productsHistory);
    } catch (error) {
      next(error);
    }
  }

  async getAllByPersonId(req, res) {
    try {
      const { id } = req.params;
      console.log('\n\n\nhola\n');
      const productsHistory = await ProductHistoryService.getAllByPersonId(id);
      return res.json(productsHistory);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const productHistory = await ProductHistoryService.getOne(id);
      return res.json(productHistory);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res) {
    try {
      const productHistory = await ProductHistoryService.update(req.body);
      return res.json(productHistory);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const productHistory = await ProductHistoryService.delete(id);
      return res.json(productHistory);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductHistoryController();