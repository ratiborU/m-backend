import FavoriteProductService from "../services/FavoriteProductService.js";

class FavoriteProductController {
  async create(req, res, next) {
    try {
      const favoriteProduct = await FavoriteProductService.create(req.body);
      return res.json(favoriteProduct);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { limit, page } = req.query;
      const favoriteProducts = await FavoriteProductService.getAll(limit, page);
      return res.json(favoriteProducts);
    } catch (error) {
      next(error);
    }
  }

  async getAllByPersonId(req, res, next) {
    try {
      const { id } = req.params;
      const { limit, page } = req.query;
      const favoriteProducts = await FavoriteProductService.getAllByPersonId(limit, page, id);
      return res.json(favoriteProducts);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const favoriteProduct = await FavoriteProductService.getOne(id);
      return res.json(favoriteProduct);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const favoriteProduct = await FavoriteProductService.update(req.body);
      return res.json(favoriteProduct);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const favoriteProduct = await FavoriteProductService.delete(id);
      return res.json(favoriteProduct);
    } catch (error) {
      next(error);
    }
  }

  async deleteByPersonAndProductId(req, res, next) {
    try {
      console.log();
      console.log('hola');
      console.log();
      const { productId, personId } = req.body;
      const favoriteProduct = await FavoriteProductService.deleteByPersonAndProductId(personId, productId);
      return res.json(favoriteProduct);
    } catch (error) {
      next(error);
    }
  }
}

export default new FavoriteProductController();