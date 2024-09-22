import CommentService from "../services/CommentService.js";

class CommentController {
    async create(req, res, next) {
        try {
            const comment = await CommentService.create(req.body);
            return res.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            let { limit, page } = req.query;
            const comments = await CommentService.getAll(limit, page);
            return res.json(comments);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const comment = await CommentService.getOne(id);
            return res.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async getAllByProductId(req, res, next) {
        try {
            const {id} = req.params;
            const { limit, page } = req.query;
            const comment = await CommentService.getAllByProductId(id, limit, page);
            return res.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async getAllByPersonId(req, res, next) {
        try {
            const {id} = req.params;
            const { limit, page } = req.query;
            const comment = await CommentService.getAllByPersonId(id, limit, page);
            return res.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const comment = await CommentService.update(req.body);
            return res.json(comment);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const comment = await CommentService.delete(id);
            return res.json(comment);
        } catch (error) {
            next(error);
        }
    }
}

export default new CommentController();