import { Product } from "../models/models.js";
import ApiError from "../error/ApiError.js";

import ProductService from "../services/ProductService.js";

class ProductController {
  async create(req, res, next) {
    try {
      let file;
      if (req.files) {
        file = req.files.file;
      }
      const product = await ProductService.create({ ...req.body, file });
      return res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page } = req.query;
      const products = await ProductService.getAll(limit, page);
      return res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductService.getOne(id);
      return res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      // console.log('\n', req.files.file, '\n');
      let file;
      if (req.files) {
        file = req.files.file;
      }
      const product = await ProductService.update({ ...req.body, file });
      return res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductService.delete(id);
      return res.json(product);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();