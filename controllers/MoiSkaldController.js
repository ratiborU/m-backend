// import MoiSkladService from "../services/MoiSkladService.js";
import MoiSkladService from "../services/MoiSkladService.js";

class MoiSkladController {
  async getAll(req, res) {
    try {
      const moiSklad = await MoiSkladService.getAllProducts();
      return res.json(moiSklad);
    } catch (error) {
      next(error);
    }
  }

  async createProducts(req, res) {
    try {
      const moiSklad = await MoiSkladService.createProductsFromApi();
      return res.json(moiSklad);
    } catch (error) {
      next(error);
    }
  }

  async updateProductsReserve(req, res) {
    try {
      const moiSklad = await MoiSkladService.updateProductsReserveFromApi();
      return res.json(moiSklad);
    } catch (error) {
      next(error);
    }
  }

}

export default new MoiSkladController();