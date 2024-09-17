import ApiError from "../error/ApiError.js";
import { Person } from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // добавит массив ошибок
            return next(ApiError.badRequest('Ошибка при валидации'));
        }
        const { 
            firstName, 
            secondName, 
            fatherName, 
            email, 
            phoneNumber, 
            password, 
            role 
        } = req.body;

        // полноценная валидация
        if (!email || !password) {
            return next(ApiError.badRequest('Некоректный email или пароль'));
        }
        const candidate = await Person.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'));
        }
        const hashedPassword = await bcrypt.hash(password, 4);
        const activationLink = uuidv4();
        const fullActivationLink = `http://localhost:5000/api/persons/activate/${activationLink}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use Gmail as the email service
            auth: {
                user: process.env.MAIL_USER, // Your Gmail email address
                pass: process.env.MAIL_APP_PASS // Your Gmail password
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER, // Sender's email address
            to: email, // Recipient's email address
            subject: 'Подтверждение почты', // Subject line
            text: '', // Plain text body
            // потом сделать красивую обложку (адаптивную)
            html: 
                `
                    <div>
                        <h1>Для активации аккаунта перейдите по ссылке</h1>
                        <a href="${fullActivationLink}">Подтвердить адрес электронной почты</a>
                    </div>
                `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        const person = await Person.create({
            firstName, 
            secondName, 
            fatherName, 
            email, 
            phoneNumber, 
            password: hashedPassword, 
            role,
            activationLink: activationLink
        });

        const tokens = generateJwtAccessAndRefresh(person.dataValues.id, email, role);
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json({ tokens });
        // return res.json({tokens: ''});
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        const person = await Person.findOne({ where: { email } });
        if (!person) {
            return next(ApiError.badRequest('Неверно указан логин или пароль'));
        }
        let comparePassword = bcrypt.compareSync(password, person.dataValues.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Неверно указан логин или пароль'));
        }
        const tokens = generateJwtAccessAndRefresh(person.dataValues.id, person.dataValues,email, person.dataValues.role);
        res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return res.json({ tokens });
    }

    // а она нужна вообще, лучше сделать на фронте
    async logout(req, res, next) {
        res.clearCookie('refreshToken');
        return res.json('Вы успешно вышли');
    }

    async activate(req, res, next) {
        const { link } = req.params;
        const person = await Person.findOne({where: {activationLink: link}});
        if (!person) {
            return next(ApiError.badRequest('Некорректная ссылка активации'));
        }
        await Person.update({
            isActivated: true,
        }, {
            where: { id: person.dataValues.id }
        });
        const updatedPerson = await Person.findOne({where: { id: person.dataValues.id }});
        return res.redirect('http://localhost:5000/api/persons/');
    }

    async refresh(req, res, next) {
        return res.json('');
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