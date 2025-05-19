import { Category } from "../models/models.js";

class CategoryService {
  async create(params) {
    const { name, description, parameters } = params;
    const category = await Category.create({ name, description, parameters })
    return category;
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 1000;
    let offset = (page - 1) * limit;
    const categories = await Category.findAndCountAll({ limit, offset });
    return categories;
  }

  async getOne(id) {
    const category = Category.findByPk(id);
    return category;
  }

  async update(params) {
    const { id, name, description, parameters } = params;
    await Category.update(
      { name, description, parameters },
      { where: { id } }
    );
    const updatedAnswer = await Category.findByPk(id);
    return updatedAnswer;
  }

  async delete(id) {
    const category = await Category.destroy({ where: { id } });
    return category;
  }
}

export default new CategoryService;