import CategoryService from "../services/CategoryService.js";

class CategoryController {
  async create(req, res) {
    try {
      const answer = await CategoryService.create(req.body);
      return res.json(answer);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res) {
    try {
      const { limit, page } = req.query;
      const answers = await CategoryService.getAll(limit, page);
      return res.json(answers);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const answer = await CategoryService.getOne(id);
      return res.json(answer);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res) {
    try {
      const answer = await CategoryService.update(req.body);
      return res.json(answer);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const answer = await CategoryService.delete(id);
      return res.json(answer);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();