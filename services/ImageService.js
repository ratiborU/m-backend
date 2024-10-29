import { Image } from "../models/models.js";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import ApiError from '../error/ApiError.js';
import { unlink } from 'fs';

class ImageService {
  async create(productId, img) {
    let fileName = uuidv4() + ".jpg";
    await img.mv(path.resolve('static', fileName));
    const image = await Image.create({ productId, path: fileName });
    return image;
  }

  async getAll() {
    const images = await Image.findAll();
    return images;
  }

  async getAllByProductId(productId) {
    const images = await Image.findAll({ where: { productId } });
    return images;
  }

  async getOne(id) {
    const image = await Image.findByPk(id);
    return image;
  }

  // на самом деле не очень нужная функция
  async update(id, productId, img) {
    const image = await Image.findByPk(id);
    if (img) {
      let fileName = uuidv4() + ".jpg";
      img.mv(path.resolve('static', fileName));
      unlink(path.resolve('static', image.dataValues.path), (error) => {
        console.log("file was deleted!");
      });

      await Image.update(
        { productId, path: fileName },
        { where: { id } }
      );
    } else {
      await Image.update(
        { productId },
        { where: { id } }
      );
    }
  }

  async delete(id) {
    const image = await Image.findByPk(id);
    unlink(path.resolve('static', image.dataValues.path), (error) => {
      console.log("file was deleted!");
    });
    await Image.destroy({ where: { id } });
  }
}

export default new ImageService;