import ApiError from "../error/ApiError.js";
import { Person } from "../models/models.js";
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

    const tokens = await this.login(person.dataValues.email, password)

    // объединить регистрация с логином
    // или сделать это на фронте
    return { tokens };
    // return activationLink;
  }

  async login(email, password) {
    const person = await Person.findOne({ where: { email } });
    if (!person) {
      throw ApiError.badRequest('Неверно указан логин или пароль');
    }
    // if (!person.dataValues.isActivated) {
    //   throw ApiError.unauthorized('Ваш аккаунт еще не был активирован через почту');
    // }
    let comparePassword = bcrypt.compareSync(password, person.dataValues.password)
    if (!comparePassword) {
      throw ApiError.badRequest('Неверно указан логин или пароль');
    }
    // console.log(person.dataValues.id, person.dataValues.email, person.dataValues.role);
    const params = {
      id: person.dataValues.id,
      email: person.dataValues.email,
      role: person.dataValues.role,
    }
    const tokens = await TokenService.generateJwtAccessAndRefresh(params);
    // console.log(tokens.accessToken);
    const decoded = jwt.verify(tokens.accessToken, process.env.SECRET_KEY);
    console.log('decoded: ', decoded);
    // console.log('hola');
    // try {
    //   const token = jwt.sign({ foo: 'bar' }, process.env.SECRET_KEY);
    //   console.log(token);
    //   const decoded = jwt.verify(token, process.env.SECRET_KEY);
    //   console.log(decoded);
    // } catch (error) {

    // }
    // 
    return tokens;
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
}

export default new AuthService;