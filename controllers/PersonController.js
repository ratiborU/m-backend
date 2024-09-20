import ApiError from "../error/ApiError.js";
import { Person } from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";

import AuthService from "../services/AuthService.js";

const generateJwt = (id, email, role, time) => {
    return jwt.sign(
        { id, email, role }, 
        process.env.SECRET_KEY,
        {expiresIn: time}
    )
}

const generateJwtAccessAndRefresh = (id, email, role) => {
    return ({
        accessToken: generateJwt(id, email, role, '30m'),
        refreshToken: generateJwt(id, email, role, '30d'),
    })
}

class PersonController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка при валидации'));
            }
            const activationLink = await AuthService.registration(req.body);
            return res.json(activationLink);
        } catch (error) {
            return next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const tokens = await AuthService.login(email, password);
            // console.log(tokens);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({ tokens });
        } catch (error) {
            return next(error);
        }
    }

    // а она нужна вообще, лучше сделать на фронте
    async logout(req, res, next) {
        res.clearCookie('refreshToken');
        return res.json('Вы успешно вышли');
    }

    async activate(req, res, next) {
        try {
            const { link } = req.params;
            await AuthService.activate(link);
            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            return next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const tokens = await AuthService.refresh(refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json({ tokens });
        } catch (error) {
            return next(error);
        }
        // const { refreshToken } = req.body;
        // if (!refreshToken) {
        //     next(ApiError.unauthorized('Пользователь не авторизован'));
        // }
        // const {id, email, role} = jwt.verify(refreshToken, process.env.SECRET_KEY);
        // const tokens = generateJwtAccessAndRefresh(id, email, role);
        // res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        // return res.json({ tokens });
    }

    async auth(req, res, next) {
        const { id, email, role } = req.person;
        const token = generateJwt(id, email, role, '30m');
        res.json({ token });
    }

    async getAll(req, res) {
        const persons = await Person.findAll();
        return res.json(persons);
    }

    async getOne(req, res) {
        const { id } = req.params;
        const person = await Person.findByPk(id);
        return res.json(person);
    }

    async update(req, res) {
        const { 
            id, 
            firstName, 
            secondName, 
            fatherName, 
            email, 
            phoneNumber, 
            isActivated,
            activationLink
        } = req.body;
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
        return res.json(person);
    }

    async delete(req, res) {
        const { id } = req.params;
        const person = await Person.destroy({
            where: { id: id }
        });
        return res.json(person);
    }
}

export default new PersonController();