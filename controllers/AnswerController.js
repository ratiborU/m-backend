import { Answer } from "../models/models.js";

class AnswerController {
    async create(req, res) {
        const { text, commentId, personId } = req.body;
        const answer = await Answer.create({ text, commentId, personId })
        return res.json(answer);
    }

    async getAll(req, res) {
        const answers = Answer.findAll();
        return res.json(answers);
    }

    async getAllByCommentId(req, res) {
        const { id } = req.params;
        const answers = Answer.findAll({ where: { commentId: id } });
        return res.json(answers);
    }

    async getAllByPersonId(req, res) {
        const { id } = req.params;
        const answers = Answer.findAll({ where: { personId: id } });
        return res.json(answers);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const answer = Answer.findByPk(id);
        return res.json(answer);
    }

    async update(req, res) {
        const { id, text, commentId, personId } = req.body;
        const answer = await Answer.update({
            text, commentId, personId
        }, {
            where: { id }
        });
        return res.json(answer);
    }

    async delete(req, res) {
        const {id} = req.params;
        const answer = await Answer.destroy({
            where: { id }
        });
        return res.json(answer);
    }
}

export default new AnswerController();