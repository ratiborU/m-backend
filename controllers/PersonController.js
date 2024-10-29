import ApiError from "../error/ApiError.js";
import { Person } from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";

import AuthService from "../services/AuthService.js";
import PersonService from "../services/PersonService.js";

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

    async create(req, res, next) {
      try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              return next(ApiError.badRequest('Ошибка при валидации'));
          }
          const activationLink = await PersonService.create(req.body);
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

    // по какой-то причине не работает активация
    async activate(req, res, next) {
        try {
            const { link } = req.params;
            await AuthService.activate(link);
            // console.log('activation');
            return res.redirect(process.env.CLIENT_URL);
            // return res.json(process.env.CLIENT_URL);
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
    }

    async auth(req, res, next) {
        const { id, email, role } = req.person;
        const token = generateJwt(id, email, role, '30m');
        res.json({ token });
    }

    async getAll(req, res, next) {
        try {
            let { limit, page } = req.query;
            const persons = await PersonService.getAll(limit, page);
            return res.json(persons);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            console.log('getOne');
            const person = await PersonService.getOne(id);
            return res.json(person);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const person = await PersonService.update(req.body);
            return res.json(person);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const person = await PersonService.delete(id);
            return res.json(person);
        } catch (error) {
            next(error);
        }
    }
}

export default new PersonController();