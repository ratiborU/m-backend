import { Product } from "../models/models.js";

class ProductService {
    async create(params) {
        const { 
            title, 
            description, 
            characteristics, 
            price, 
            rate, 
            commentsCount 
        } = params;
        const product = await Product.create({
            title, 
            description, 
            characteristics, 
            price, 
            rate, 
            commentsCount
        });
        return product;
    }

    async getAll(limit, page) {
        page = page || 1;
        limit = limit || 16;
        let offset = (page - 1) * limit;
        const products = await Product.findAndCountAll({limit: limit, offset: offset});
        return products;
    }

    async getOne(id) {
        const product = await Product.findByPk(id);
        return product;
    }

    async update(params) {
        const { 
            id, 
            title, 
            description, 
            characteristics, 
            price, 
            rate, 
            commentsCount 
        } = params;
        const product = await Product.update({
            title, 
            description, 
            characteristics, 
            price, 
            rate, 
            commentsCount
        }, {
            where: { id }
        });
    }

    async addRate(id, rate) {
        const product = await Product.findByPk(id);
        const updatedRate = (product.dataValues.rate * product.dataValues.commentsCount + Number(rate)) / (product.dataValues.commentsCount + 1)
        
        await Product.update({
            rate: updatedRate, 
            commentsCount: product.dataValues.commentsCount + 1
        }, {
            where: { id }
        });
        const updatedProduct = await Product.findByPk(id);
        return updatedProduct;
    }

    async removeRate(id, rate) {
        const product = await Product.findByPk(id);
        const updatedRate = (product.dataValues.rate * product.dataValues.commentsCount - Number(rate)) / (product.dataValues.commentsCount - 1)

        await Product.update({
            rate: updatedRate, 
            commentsCount: product.dataValues.commentsCount - 1
        }, {
            where: { id }
        });
        const updatedProduct = await Product.findByPk(id);
        return updatedProduct;
    }

    async delete(id) {
        const product = await Product.destroy({
            where: { id }
        });
        return product;
    }
}

export default new ProductService;