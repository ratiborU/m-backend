import ApiError from "../error/ApiError.js";
import { Person, Loyal } from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";

import MailService from "./MailService.js";
import TokenService from "./TokenService.js";

class AuthService {
  async registration(params) {
    const {
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
      password,
      role
    } = params;

    const candidateEmail = await Person.findOne({ where: { email } });
    const candidatePhone = await Person.findOne({ where: { phoneNumber } });

    if (candidateEmail) {
      throw ApiError.badRequest('Пользователь с таким email уже существует');
    }
    if (candidatePhone) {
      throw ApiError.badRequest('Пользователь с таким номером телефона уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 4);
    const activationLink = uuidv4();
    const fullActivationLink = `${process.env.SERVER_URL}/persons/activate/${activationLink}`;

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

    const tokens = await this.login(person.dataValues.email, password)
    return { tokens };
  }

  async registrationFromEmpty(params) {
    const {
      id,
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
      password,
      // role
    } = params;

    const candidate = await Person.findByPk(id);
    const candidateEmail = await Person.findOne({ where: { email } });
    const candidatePhone = await Person.findOne({ where: { phoneNumber } });

    if (candidateEmail
      && candidateEmail.dataValues.email != ''
      && candidateEmail.dataValues.email != candidate.dataValues.email
    ) {
      throw ApiError.badRequest('Пользователь с таким email уже существует');
    }
    if (candidatePhone
      && candidateEmail.dataValues.phoneNumber != ''
      && candidateEmail.dataValues.phoneNumber != candidate.dataValues.phoneNumber
    ) {
      throw ApiError.badRequest('Пользователь с таким номером телефона уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 4);
    const activationLink = uuidv4();
    const fullActivationLink = `${process.env.SERVER_URL}/persons/activate/${activationLink}`;

    // отправка письма на почту
    MailService.sendActivationLink(email, fullActivationLink);

    const person = await Person.update({
      firstName,
      secondName,
      fatherName,
      email,
      phoneNumber,
      password: hashedPassword,
      activationLink
    }, {
      where: { id }
    });

    const loyal = await Loyal.findOne({ where: { personId: id } })
    if (!loyal) {
      const loyal = await Loyal.create({
        personId: id
      })
    }

    const tokens = await this.login(email, password)
    return tokens;
  }

  async login(email, password) {
    const person = await Person.findOne({ where: { email } });
    if (!person) {
      throw ApiError.badRequest('Неверно указан логин или пароль');
    }
    let comparePassword = bcrypt.compareSync(password, person.dataValues.password)
    if (!comparePassword) {
      throw ApiError.badRequest('Неверно указан логин или пароль');
    }
    const params = {
      id: person.dataValues.id,
      email: person.dataValues.email,
      role: person.dataValues.role,
    }
    const tokens = await TokenService.generateJwtAccessAndRefresh(params);
    const decoded = jwt.verify(tokens.accessToken, process.env.SECRET_KEY);

    return {
      tokens,
      person
    };
  }

  async createEmpty() {
    const person = await Person.create({
      firstName: '',
      secondName: '',
      fatherName: '',
      email: '',
      phoneNumber: '',
      password: '',
    });

    const params = {
      id: person.dataValues.id,
      email: person.dataValues.email,
      role: person.dataValues.role,
    }
    const tokens = await TokenService.generateJwtAccessAndRefresh(params);

    return {
      tokens,
      person,
    };
  }

  async activate(link) {
    const person = await Person.findOne({ where: { activationLink: link } });
    if (!person) {
      throw ApiError.badRequest('Некорректная ссылка активации');
    }
    await Person.update({
      isActivated: true,
    }, {
      where: { id: person.dataValues.id }
    });
    // какая-то ошибка с редиректом
    return { message: "активация прошла успешно" };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Пользователь не авторизован');
    }
    try {
      jwt.verify(refreshToken, process.env.SECRET_KEY);
    } catch (error) {
      throw ApiError.unauthorized('Пользователь не авторизован');
    }
    const { id, email, role } = jwt.verify(refreshToken, process.env.SECRET_KEY);
    const tokens = TokenService.generateJwtAccessAndRefresh({ id, email, role });
    return tokens;
  }

  async logout() {
    return { message: 'logout completed succesfully' };
  }
}

export default new AuthService;