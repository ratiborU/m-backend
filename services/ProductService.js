import { Product } from "../models/models.js";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { unlink } from 'fs';

class ProductService {
  async create(params) {
    const {
      name,
      description,
      seoTitle,
      seoDescription,
      characteristics,
      price,
      discount,
      rate,
      commentsCount,
      productsCount,
      categoryId,
      file = ''
    } = params;
    let fileName = '';
    if (file) {
      fileName = uuidv4() + ".jpg";
      await file.mv(path.resolve('static', fileName));
    }

    const product = await Product.create({
      name,
      description,
      seoTitle,
      seoDescription,
      characteristics,
      price,
      discount,
      rate,
      commentsCount,
      productsCount,
      categoryId,
      mainImage: fileName
    });
    return product;
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 16;
    let offset = (page - 1) * limit;
    const products = await Product.findAndCountAll({ limit, offset });
    return products;
  }

  async getOne(id) {
    const product = await Product.findByPk(id);
    return product;
  }

  async update(params) {
    const {
      id,
      name,
      description,
      seoTitle,
      seoDescription,
      characteristics,
      price,
      discount,
      rate,
      commentsCount,
      productsCount,
      categoryId,
      file
    } = params;

    const product = await Product.findByPk(id);

    let fileName = product.mainImage;
    if (file) {
      fileName = uuidv4() + ".jpg";
      await file.mv(path.resolve('static', fileName));
      unlink(path.resolve('static', product.dataValues.mainImage), (error) => {
        console.log("file was deleted!");
      });
    }

    await Product.update({
      name: name || product.name,
      description: description || product.description,
      seoTitle: seoTitle || product.seoTitle,
      seoDescription: seoDescription || product.seoDescription,
      characteristics: characteristics || product.characteristics,
      price: price || product.price,
      discount: discount || product.discount,
      rate: rate || product.rate,
      commentsCount: commentsCount || product.commentsCount,
      productsCount: productsCount || product.productsCount,
      categoryId: categoryId || product.categoryId,
      mainImage: fileName
    }, {
      where: { id }
    });

    const updatedProduct = await Product.findByPk(id)
    return updatedProduct;
  }

  // возможно стоит перенести эти методы в CommentService
  async addRate(id, rate) {
    const product = await Product.findByPk(id);
    const updatedRate = (product.dataValues.rate * product.dataValues.commentsCount + Number(rate)) / (product.dataValues.commentsCount + 1)

    await Product.update({
      rate: updatedRate,
      commentsCount: product.dataValues.commentsCount + 1
    }, {
      where: { id }
    });
    const updatedProduct = await Product.findByPk(id);
    return updatedProduct;
  }

  async changeRate(id, oldRate, newRate) {
    const product = await Product.findByPk(id);
    const rate = (product.dataValues.rate * product.dataValues.commentsCount + Number(newRate) - Number(oldRate)) / (product.dataValues.commentsCount)

    await Product.update({ rate }, { where: { id } });
    const updatedProduct = await Product.findByPk(id);
    return updatedProduct;
  }

  async removeRate(id, rate) {
    const product = await Product.findByPk(id);
    const updatedRate = (product.dataValues.rate * product.dataValues.commentsCount - Number(rate)) / (product.dataValues.commentsCount - 1 || 1)

    await Product.update({
      rate: updatedRate,
      commentsCount: product.dataValues.commentsCount - 1
    }, {
      where: { id }
    });
    const updatedProduct = await Product.findByPk(id);
    return updatedProduct;
  }

  async delete(id) {
    const product = await Product.destroy({
      where: { id }
    });
    return product;
  }
}

export default new ProductService;