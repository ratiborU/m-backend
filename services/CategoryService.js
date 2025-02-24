import { Category } from "../models/models.js";

class CategoryService {
  async create(params) {
    const { name, description } = params;
    const category = await Category.create({ name, description })
    return category;
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 100;
    let offset = (page - 1) * limit;
    const categories = await Category.findAndCountAll({ limit, offset });
    return categories;
  }

  async getAllByCommentId(commentId) {
    const categories = await Category.findAll({ where: { commentId } });
    return categories;
  }

  async getAllByPersonId(personId) {
    const category = await Category.findAll({ where: { personId } });
    return category;
  }

  async getOne(id) {
    const category = Category.findByPk(id);
    return category;
  }

  async update(params) {
    const { id, name, description } = params;
    await Category.update(
      { name, description },
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