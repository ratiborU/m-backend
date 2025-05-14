import LoyalService from "../services/LoyalService.js";
import RecomendationService from "../services/RecomendationService.js";

class RecomendationController {
  async createAll(req, res) {
    try {
      const productsTfIdf = await RecomendationService.createAll();
      return res.json(productsTfIdf);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res) {
    try {
      const productsTfIdf = await RecomendationService.getAll();
      return res.json(productsTfIdf);
    } catch (error) {
      next(error);
    }
  }

  async getSimularProductsByProductId(req, res) {
    try {
      const { id } = req.params;
      const productsTfIdf = await RecomendationService.getSimularProductsByProductId(id);
      return res.json(productsTfIdf);
    } catch (error) {
      next(error);
    }
  }

  // getRecomendationByPersonId

  async getRecomendationByPersonId(req, res) {
    try {
      const { id } = req.params;
      const productsTfIdf = await RecomendationService.getRecomendationByPersonId(id);
      return res.json(productsTfIdf);
    } catch (error) {
      next(error);
    }
  }

  async updateAll(req, res) {
    try {
      const productsTfIdf = await RecomendationService.updateAll(req.body);
      return res.json(productsTfIdf);
    } catch (error) {
      next(error);
    }
  }
}

export default new RecomendationController();