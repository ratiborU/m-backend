import { Product } from "../models/models.js";
import ApiError from "../error/ApiError.js"; 

class ProductController {
    async create(req, res) {
        const { title, description, characteristics, price, rate, commentsCount } = req.body;
        const product = await Product.create({title, description, characteristics, price, rate, commentsCount})
        return res.json(product);
    }

    async getAll(req, res) {
        let { limit, page } = req.query;
        page = page || 1;
        limit = limit || 16;
        let offset = (page - 1) * limit;
        const products = await Product.findAndCountAll({limit: limit, offset: offset});
        return res.json(products);
    }

    async getOne(req, res) {
        const {id} = req.params;
        const product = await Product.findByPk(id);
        return res.json(product);
    }

    async update(req, res) {
        const { id, title, description, characteristics, price, rate, commentsCount } = req.body;
        const product = await Product.update({
            title, description, characteristics, price, rate, commentsCount
        }, {
            where: { id: id }
        });
        return res.json(product);
    }

    async addRate(req, res) {
        const { id, rate } = req.query;
        const product = await Product.findByPk(id);
        const updatedRate = (product.dataValues.rate * product.dataValues.commentsCount + Number(rate)) / (product.dataValues.commentsCount + 1)
        
        await Product.update({
            rate: updatedRate, 
            commentsCount: product.dataValues.commentsCount + 1
        }, {
            where: { id: id }
        });
        const updatedProduct = await Product.findByPk(id);
        return res.json(updatedProduct);
    }

    async removeRate(req, res) {
        const { id, rate } = req.query;
        const product = await Product.findByPk(id);
        const updatedRate = (product.dataValues.rate * product.dataValues.commentsCount - Number(rate)) / (product.dataValues.commentsCount - 1)

        await Product.update({
            rate: updatedRate, 
            commentsCount: product.dataValues.commentsCount - 1
        }, {
            where: { id: id }
        });
        const updatedProduct = await Product.findByPk(id);
        return res.json(updatedProduct);
    }

    async delete(req, res) {
        const {id} = req.params;
        const product = await Product.destroy({
            where: { id: id }
        });
        return res.status(200).json(product);
    }
}

export default new ProductController();