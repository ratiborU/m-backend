import ApiError from "../error/ApiError.js";
import { BasketProduct, Category, FavoriteProduct, Product } from "../models/models.js";

class FavoriteProductService {
  async create(params) {
    const { productId, personId } = params;
    const product = await FavoriteProduct.findOne({ where: { productId, personId } });
    if (product) {
      throw ApiError.badRequest('Товар уже давблен в избранное данного пользователя');
    }
    const favoriteProduct = await FavoriteProduct.create({ productId, personId });
    return favoriteProduct;
  }

  // сделать include в products для того чтобы в ленте отслеживать какие товары добавлены в избранное а какие нет
  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 1000;
    const offset = (page - 1) * limit;
    const favoriteProducts = await FavoriteProduct.findAndCountAll({ limit, offset, include: { model: Product, include: Category } });
    return favoriteProducts;
  }

  async getAllByPersonId(limit, page, personId) {
    page = page || 1;
    limit = limit || 1000;
    const offset = (page - 1) * limit;
    const favoriteProducts = await FavoriteProduct.findAll(
      {
        where: { personId },
        include: {
          model: Product,
          include: [
            Category,
            { model: BasketProduct, where: { personId }, required: false }

          ]
        }
      }
    );

    for (let i = 0; i < favoriteProducts.length; i++) {
      if (favoriteProducts[i].dataValues.product.dataValues.basket_products.length > 0) {
        favoriteProducts[i].dataValues.product.dataValues.basketProduct = favoriteProducts[i].dataValues.product.dataValues.basket_products[0].dataValues
      }
      delete favoriteProducts[i].dataValues.product.dataValues.basket_products;
    }

    return favoriteProducts;
  }

  async getOne(id) {
    const favoriteProduct = await FavoriteProduct.findByPk(id, { include: { model: Product, include: Category } });
    return favoriteProduct;
  }

  async update(params) {
    const { id, productId, personId } = params;
    await FavoriteProduct.update(
      { productId, personId },
      { where: { id } }
    );
    const updatedFavoriteProduct = await FavoriteProduct.findByPk(id, { include: { model: Product, include: Category } })
    return updatedFavoriteProduct;
  }

  async delete(id) {
    const favoriteProduct = await FavoriteProduct.findByPk(id)
    await FavoriteProduct.destroy({ where: { id } });
    return favoriteProduct;
  }

  async deleteByPersonAndProductId(personId, productId) {
    const favoriteProduct = await FavoriteProduct.findOne(
      { where: { personId: String(personId), productId: String(productId) } }
    )
    await FavoriteProduct.destroy({ where: { id: favoriteProduct.dataValues.id } });
    return favoriteProduct;
  }
}

export default new FavoriteProductService;