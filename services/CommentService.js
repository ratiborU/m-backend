import { Answer, Comment, Person, Product } from "../models/models.js";
import ApiError from "../error/ApiError.js";
import ProductService from "./ProductService.js";
import LoyalService from "./LoyalService.js";
import { ProductHistory } from "../models/models.js";

// может быть можно добавить фотографии к комментарию
class CommentService {
  async create(params) {
    const { text, rate, personId, productId } = params;
    const findComment = await Comment.findOne({ where: { personId, productId } });
    if (findComment) {
      throw ApiError.badRequest('Комментарий пользователя на этот продукт уже существует');
    }
    const productHistory = await ProductHistory.findOne({ where: { personId, productId } });
    if (productHistory) {
      await ProductHistory.update(
        { rate },
        { where: { personId, productId } }
      )
    } else {
      await ProductHistory.create({ personId, productId, rate })
    }
    const comment = await Comment.create({ text, rate, personId, productId });
    if (text.split(' ').length > 10) {
      await LoyalService.addPoints(personId, 50);
    } else if (text.split(' ').length > 1) {
      await LoyalService.addPoints(personId, 30)
    } else {
      await LoyalService.addPoints(personId, 20)
    }

    await ProductService.addRate(productId, rate);
    return comment;
    // return {}
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 1000;
    const offset = (page - 1) * limit;
    const comments = await Comment.findAndCountAll({ limit, offset, include: [Person, Product, Answer] });
    return comments;
  }

  async getOne(id) {
    const comment = await Comment.findByPk(id, { include: [Person, Product, Answer] });
    // если не нашел выкинуть ошибку
    return comment;
  }

  // нужно потестить
  async getAllByProductId(productId, limit, page) {
    page = page || 1;
    limit = limit || 1000;
    const offset = (page - 1) * limit;
    const comments = await Comment.findAndCountAll({
      where: { productId },
      limit,
      offset,
      include: [
        { model: Person, attributes: ['id', 'firstName', 'secondName', 'fatherName'] },
        Product,
        Answer
      ],
      order: [['id', 'DESC']],
    });
    return comments;
  }

  async getAllByPersonId(personId, limit, page) {
    // page = page || 1;
    // limit = limit || 1000;
    // const offset = (page - 1) * limit;
    const comments = await Comment.findAll(
      { where: { personId }, include: [Person, Product, Answer] }
    );
    return comments;
  }

  async getOneByPersonAndProductId(personId, productId) {
    const comments = await Comment.findOne(
      { where: { personId, productId }, include: [Person, Product] }
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
    const updatedComment = await Comment.findByPk(id, { include: [Person, Product] })
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