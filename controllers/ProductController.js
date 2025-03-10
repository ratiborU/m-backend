import { Product } from "../models/models.js";
import ApiError from "../error/ApiError.js";
import jwt from "jsonwebtoken";

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
      // нужно не просто проверить на существование 
      // а проверить на правильность декодирования
      if (req.headers.authorization) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
        const products = await ProductService.getAllByPersonId(limit, page, decoded.id);
        // console.log(products[0].dataValues);
        return res.json(products);
      } else {
        const products = await ProductService.getAll(limit, page);
        return res.json(products);
      }
      // const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
      // console.log(decoded);
      // const products = await ProductService.getAll(limit, page);
      // return res.json(products);
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