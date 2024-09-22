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

        MailService.sendActivationLink(email, fullActivationLink);

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

    async login(email, password) {
        const person = await Person.findOne({ where: { email } });
        if (!person) {
            throw ApiError.badRequest('Неверно указан логин или пароль');
        }
        if (!person.dataValues.isActivated) {
            throw ApiError.unauthorized('Ваш аккаунт еще не был активирован через почту');
        }
        let comparePassword = bcrypt.compareSync(password, person.dataValues.password)
        if (!comparePassword) {
            throw ApiError.badRequest('Неверно указан логин или пароль');
        }

        const tokens = await TokenService.generateJwtAccessAndRefresh(person.dataValues.id, person.dataValues.email, person.dataValues.role);
        // res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        console.log(tokens);
        return tokens;
    }

    async activate(link) {
        const person = await Person.findOne({where: {activationLink: link}});
        if (!person) {
            throw ApiError.badRequest('Некорректная ссылка активации');
        }
        await Person.update({
            isActivated: true,
        }, {
            where: { id: person.dataValues.id }
        });
        // какая-то ошибка с редиректом
        return {message: "активация прошла успешно"};
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorized('Пользователь не авторизован');
        }
        const {id, email, role} = jwt.verify(refreshToken, process.env.SECRET_KEY);
        const tokens = TokenService.generateJwtAccessAndRefresh({id, email, role});
        return tokens;
    }
}

export default new AuthService;