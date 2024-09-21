import { Person } from "../models/models.js";

class PersonService {
    async getAll(limit, page) {
        page = page || 1;
        limit = limit || 25;
        let offset = (page - 1) * limit;
        const persons = await Person.findAndCountAll({limit: limit, offset: offset});
        return persons;
    }

    async getOne(id) {
        const person = await Person.findByPk(id);
        return person;
    }

    async update(params) {
        const { 
            id, 
            firstName, 
            secondName, 
            fatherName, 
            email, 
            phoneNumber, 
            isActivated,
            activationLink
        } = params;
        const person = await Person.update({
            firstName, 
            secondName, 
            fatherName, 
            email, 
            phoneNumber, 
            isActivated,
            activationLink
        }, {
            where: { id: id }
        });
        return person;
    }

    async delete(id) {
        const person = await Person.destroy({
            where: { id }
        });
        return person;
    }
}

export default new PersonService;