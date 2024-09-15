import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Image } from '../models/models.js';
import ApiError from '../error/ApiError.js';
import { unlink } from 'fs';

class ImageController {
    async create(req, res, next) {
        try {
            const { productId } = req.body;
            const { img } = req.files;
            let fileName = uuidv4() + ".jpg";
            img.mv(path.resolve('static', fileName));
            const image = await Image.create({productId, path: fileName});
            return res.json(image);
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res) {
        const images = await Image.findAll();
        return res.json(images);
    }

    async getAllByProductId(req, res) {
        const { id } = req.params;
        const images = await Image.findAll({where: {productId: id}});
        return res.json(images);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const image = await Image.findByPk(id);
        return res.json(image);
    }

    async update(req, res) {
        const { id, productId } = req.body;
        const { img } = req.files;
        let fileName = uuidv4() + ".jpg";
        img.mv(path.resolve('static', fileName));

        const image = await Image.findByPk(id);
        unlink(path.resolve('static', image.dataValues.path), (error) => {
            console.log("file was deleted!");
        });

        await Image.update({
            productId, path: fileName
        }, {
            where: { id: id }
        });
        return res.json('');
    }

    async delete(req, res) {
        const { id } = req.params;
        const image = await Image.findByPk(id);
        unlink(path.resolve('static', image.dataValues.path), (error) => {
            console.log("file was deleted!");
        });
        await Image.destroy({
            where: { id: id }
        });
        // console.log(path.resolve('static', image.dataValues.path));
        return res.json('');
    }
}

export default new ImageController();