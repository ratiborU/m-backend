import { Person } from "../models/models.js";

class PersonService {
  async create(params) {
    const {
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
      password,
      role
    } = params;

    const candidate = await Person.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.badRequest('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 4);
    const activationLink = uuidv4();
    const fullActivationLink = `http://localhost:5000/api/persons/activate/${activationLink}`;

    // отправка письма на почту
    // MailService.sendActivationLink(email, fullActivationLink);

    const person = await Person.create({
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      activationLink
    });

    // объединить регистрация с логином
    // или сделать это на фронте

    return activationLink;
  }

  async getAll(limit, page) {
    page = page || 1;
    limit = limit || 25;
    let offset = (page - 1) * limit;
    const persons = await Person.findAndCountAll({ limit: limit, offset: offset });
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
      activationLink
    } = params;
    const updatedPerson = await Person.update({
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
      isActivated,
      role,
      activationLink
    }, {
      where: { id: id }
    });
    const person = await Person.findByPk(id);
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