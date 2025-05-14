import LoyalService from "../services/LoyalService.js";

class LoyalController {
  async create(req, res) {
    try {
      const loyal = await LoyalService.create(req.body);
      return res.json(loyal);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res) {
    try {
      const { limit, page } = req.query;
      const loyals = await LoyalService.getAll(limit, page);
      return res.json(loyals);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const loyal = await LoyalService.getOne(id);
      return res.json(loyal);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res) {
    try {
      const loyal = await LoyalService.update(req.body);
      return res.json(loyal);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const loyal = await LoyalService.delete(id);
      return res.json(loyal);
    } catch (error) {
      next(error);
    }
  }
}

export default new LoyalController();