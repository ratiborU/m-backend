import { where } from "sequelize";
import { Product, Category, ProductHistory } from "../models/models.js";


class ProductHistoryService {
  async create(params) {
    const {
      count,
      inOrderCount,
      viewsCount,
      isInFavorite,
      recomendationK,
      productId,
      personId,
    } = params;

    const product = await ProductHistory.create({
      count,
      inOrderCount,
      viewsCount,
      isInFavorite,
      recomendationK,
      productId,
      personId,
    });

    return product;
  }

  async getAll() {
    const products = await ProductHistory.findAll({ include: Product });
    return products;
  }

  async getAllByPersonId(personId) {
    const products = await ProductHistory.findAll({
      include: Product,
      where: { personId }
    });
    return products;
  }

  async getOne(id) {
    const product = await ProductHistory.findByPk(id, { include: Product });
    return product;
  }

  async updateView(productId, personId) {
    const productHistory = await ProductHistory.findOne({ where: { productId, personId } });

    if (productHistory) {
      await productHistory.increment('viewsCount');
      await productHistory.reload()
    } else {
      const newProductHistory = await ProductHistory.create({
        viewsCount: 1,
        productId,
        personId,
      });
      return newProductHistory
    }

    return productHistory;
  }

  async updateCount(productId, personId, count) {
    const productHistory = await ProductHistory.findOne({ where: { productId, personId } });

    if (productHistory) {
      await productHistory.increment('count', { by: count });
      await productHistory.reload()
    } else {
      const newProductHistory = await ProductHistory.create({
        count,
        productId,
        personId,
      });
      return newProductHistory
    }

    return productHistory;
  }

  async updateInOrderCount(productId, personId) {
    const productHistory = await ProductHistory.findOne({ where: { productId, personId } });

    if (productHistory) {
      await productHistory.increment('inOrderCount');
      await productHistory.reload()
    } else {
      const newProductHistory = await ProductHistory.create({
        inOrderCount: 1,
        productId,
        personId,
      });
      return newProductHistory
    }

    return productHistory;
  }

  async updateisInFavorite(productId, personId) {
    const productHistory = await ProductHistory.findOne({ where: { productId, personId } });

    if (productHistory) {
      productHistory.isInFavorite = !productHistory.dataValues.isInFavorite;
      await productHistory.save({ fields: ['isInFavorite'] })
      await productHistory.reload()
    } else {
      const newProductHistory = await ProductHistory.create({
        isInFavorite: true,
        productId,
        personId,
      });
      return newProductHistory
    }

    return productHistory;
  }

  async update(params) {
    const {
      id,
      count,
      inOrderCount,
      viewsCount,
      isInFavorite,
      recomendationK,
      productId,
      personId,
    } = params;

    const productHistory = await ProductHistory.findByPk(id);


    await Product.update({
      count: count || productHistory.dataValues.count,
      inOrderCount: inOrderCount || productHistory.dataValues.inOrderCount,
      viewsCount: viewsCount || productHistory.dataValues.viewsCount,
      isInFavorite: isInFavorite || productHistory.dataValues.isInFavorite,
      recomendationK: recomendationK || productHistory.dataValues.recomendationK,
      productId: productId || productHistory.dataValues.productId,
      personId: personId || productHistory.dataValues.personId,
    }, {
      where: { id }
    });

    const updatedProduct = await ProductHistory.findByPk(id, { include: Category })
    return updatedProduct;
  }



  async delete(id) {
    const product = await ProductHistory.destroy({ where: { id } });
    return product;
  }
}

export default new ProductHistoryService;