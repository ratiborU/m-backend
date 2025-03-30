import { Product, Category, BasketProduct, FavoriteProduct } from "../models/models.js";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { unlink } from 'fs';
import { sequelize } from "../db.js";

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
    limit = limit || 100;
    let offset = (page - 1) * limit;
    const products = await Product.findAndCountAll({ limit, offset, include: Category });
    return products;
  }

  async getAllByPersonId(limit, page, id) {
    page = page || 1;
    limit = limit || 100;
    let offset = (page - 1) * limit;
    const products = await Product.findAndCountAll(
      {
        // limit, offset,
        include: [
          { model: Category },
          { model: FavoriteProduct, where: { personId: id }, required: false },
          {
            model: BasketProduct,
            where: { personId: id },
            required: false,
          },
        ],
        order: [['id', 'DESC']]
      }
    );

    for (let i = 0; i < products.rows.length; i++) {
      if (products.rows[i].dataValues.favorite_products.length > 0) {
        products.rows[i].dataValues.favoriteProduct = products.rows[i].dataValues.favorite_products[0].dataValues;
      }
      delete products.rows[i].dataValues.favorite_products;

      if (products.rows[i].dataValues.basket_products.length > 0) {
        products.rows[i].dataValues.basketProduct = products.rows[i].dataValues.basket_products[0].dataValues;
      }
      delete products.rows[i].dataValues.basket_products;
    }
    return products;
  }

  async getOne(id) {
    const product = await Product.findByPk(id, { include: Category });
    return product;
  }

  async getOneWithPersonId(id, personId) {
    const product = await Product.findByPk(id,
      {
        include: [
          { model: Category },
          { model: FavoriteProduct, where: { personId }, required: false },
          {
            model: BasketProduct,
            where: { personId },
            required: false,
          }
        ]
      },
    );

    if (product.dataValues.favorite_products.length > 0) {
      product.dataValues.favoriteProduct = product.dataValues.favorite_products[0].dataValues;
    }

    if (product.dataValues.basket_products.length > 0) {
      product.dataValues.basketProduct = product.dataValues.basket_products[0].dataValues;
    }

    delete product.dataValues.favorite_products;
    delete product.dataValues.basket_products;

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

    const updatedProduct = await Product.findByPk(id, { include: Category })
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
    const updatedProduct = await Product.findByPk(id, { include: Category });
    return updatedProduct;
  }

  async changeRate(id, oldRate, newRate) {
    const product = await Product.findByPk(id);
    const rate = (product.dataValues.rate * product.dataValues.commentsCount + Number(newRate) - Number(oldRate)) / (product.dataValues.commentsCount)

    await Product.update({ rate }, { where: { id } });
    const updatedProduct = await Product.findByPk(id, { include: Category });
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
    const updatedProduct = await Product.findByPk(id, { include: Category });
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