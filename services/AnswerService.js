import { Answer } from "../models/models.js";

class AnswerService {
    async create(params) {
        const { text, commentId, personId } = params;
        const answer = await Answer.create({ text, commentId, personId })
        return answer;
    }

    async getAll(limit, page) {
        page = page || 1;
        limit = limit || 16;
        let offset = (page - 1) * limit;
        const answers = await Answer.findAndCountAll({limit, offset});
        return answers;
    }

    async getAllByCommentId(commentId) {
        const answers = await Answer.findAll({where: {commentId}});
        // console.log(answers);
        return answers;
    }

    async getAllByPersonId(personId) {
        const answer = await Answer.findAll({where: {personId}});
        return answer;
    }

    async getOne(id) {
        const answer = Answer.findByPk(id);
        return answer;
    }

    async update(params) {
        const { id, text, commentId, personId } = params;
        await Answer.update(
            {text, commentId, personId}, 
            {where: { id }}
        );
        const updatedAnswer = await Answer.findByPk(id);
        return updatedAnswer;
    }

    async delete(id) {
        const answer = await Answer.destroy({where: { id }});
        return answer;
    }
}

export default new AnswerService;