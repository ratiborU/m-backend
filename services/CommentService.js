import { Comment, Person } from "../models/models.js";
import ApiError from "../error/ApiError.js";
import ProductService from "./ProductService.js";

class CommentService {
  async create(params) {
    const { text, rate, personId, productId } = params;
    const findComment = await Comment.findOne({ where: { personId, productId } });
    if (findComment) {
      throw ApiError.badRequest('Комментарий пользователя на этот продукт уже существует');
    }
    const comment = await Comment.create({ text, rate, personId, productId });
    await ProductService.addRate(productId, rate);
    return comment;
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 100;
    const offset = (page - 1) * limit;
    const comments = await Comment.findAndCountAll({ limit, offset, include: Person });
    return comments;
  }

  async getOne(id) {
    const comment = await Comment.findByPk(id, { include: Person });
    // если не нашел выкинуть ошибку
    return comment;
  }

  // нужно потестить
  async getAllByProductId(productId, limit, page) {
    page = page || 1;
    limit = limit || 100;
    const offset = (page - 1) * limit;
    const comments = await Comment.findAndCountAll(
      { where: { productId }, limit, offset, include: Person }
    );
    return comments;
  }

  async getAllByPersonId(personId, limit, page) {
    page = page || 1;
    limit = limit || 100;
    const offset = (page - 1) * limit;
    const comments = await Comment.findAndCountAll(
      { where: { personId }, limit, offset, include: Person }
    );
    return comments;
  }

  async update(params) {
    const { id, text, rate, personId, productId } = params;
    const comment = await Comment.findByPk(id);
    // await ProductService.removeRate(productId, comment.dataValues.rate);
    // await ProductService.add(productId, rate);
    await ProductService.changeRate(productId, comment.dataValues.rate, rate);
    await Comment.update(
      { text, rate, personId, productId },
      { where: { id } }
    );
    const updatedComment = await Comment.findByPk(id, { include: Person })
    return updatedComment;
  }

  async delete(id) {
    const comment = await Comment.findByPk(id);
    await ProductService.removeRate(comment.dataValues.productId, comment.dataValues.rate);
    await Comment.destroy({ where: { id } });
    return comment;
  }
}

export default new CommentService;