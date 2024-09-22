import { Answer } from "../models/models.js";
import AnswerService from "../services/AnswerService.js";

class AnswerController {
    async create(req, res) {
        try {
            const answer = await AnswerService.create(req.body);
            return res.json(answer);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res) {
        try {
            const { limit, page } = req.query;
            const answers = await AnswerService.getAll(limit, page);
            return res.json(answers);
        } catch (error) {
            next(error);
        }
    }

    async getAllByCommentId(req, res) {
        try {
            const { id } = req.params;
            const answers = await AnswerService.getAllByCommentId(id);
            return res.json(answers);
        } catch (error) {
            next(error);
        }
    }

    async getAllByPersonId(req, res) {
        try {
            const { id } = req.params;
            const answers = await AnswerService.getAllByPersonId(id);
            return res.json(answers);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const answer = await AnswerService.getOne(id);
            return res.json(answer);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res) {
        try {
            const answer = await AnswerService.update(req.body);
            return res.json(answer);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            const answer = await AnswerService.delete(id);
            return res.json(answer);
        } catch (error) {
            next(error);
        }
    }
}

export default new AnswerController();