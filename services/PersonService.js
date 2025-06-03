import { Person } from "../models/models.js";

class PersonService {
  async create(params) {
    const {
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
    } = params;


    const person = await Person.create({
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
    });

    return person;
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 1000;
    let offset = (page - 1) * limit;
    const persons = await Person.findAndCountAll({ limit: 100000, offset: 0 });
    persons.rows = persons.rows.filter(x => x.dataValues.firstName != '')
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
      role,
      activationLink,
      newPassword
    } = params;

    // const person = await Person.findByPk(id);
    let hashedPassword;
    if (newPassword) {
      // hashedPassword = await bcrypt.hash(newPassword, 4);
    }

    const updatedPerson = await Person.update({
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
      isActivated,
      role,
      activationLink,
      // password: hashedPassword || person.dataValues.password
    }, {
      where: { id: id }
    });
    const newPerson = await Person.findByPk(id);
    return newPerson;
  }

  async delete(id) {
    const person = await Person.destroy({
      where: { id }
    });
    return person;
  }
}

export default new PersonService;