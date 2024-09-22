import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Image } from '../models/models.js';
import ApiError from '../error/ApiError.js';
import { unlink } from 'fs';

import ImageService from '../services/ImageService.js';

class ImageController {
    async create(req, res, next) {
        try {
            const { productId } = req.body;
            const { img } = req.files;
            const image = await ImageService.create(productId, img);
            return res.json(image);
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const images = await ImageService.getAll();
            return res.json(images);
        } catch (error) {
            next(error)
        }
    }

    async getAllByProductId(req, res, next) {
        try {
            const { id } = req.params;
            const images = await ImageService.getAllByProductId(id);
            return res.json(images);
        } catch (error) {
            next(error)
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const image = await ImageService.getOne(id);
            return res.json(image);
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const { id, productId } = req.body;
            const { img } = req.files;
            await ImageService.update(id, productId, img);
            return res.json({message: 'Фотография успешно обновлена'});
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await ImageService.delete(id);
            return res.json({message: 'Фотография успешно удалена'});
        } catch (error) {
            next(error);
        }
    }
}

export default new ImageController();