import ApiError from "../error/ApiError.js";
import { Person } from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role }, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class PersonController {
    async registration(req, res, next) {
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
        
        console.log(hashedPassword);

        const person = await Person.create({
            firstName, 
            secondName, 
            fatherName, 
            email, 
            phoneNumber, 
            password: hashedPassword, 
            role
        });

        const token = generateJwt(person.dataValues.id, email, role);
    
        return res.json({token});
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        const person = await Person.findOne({ where: { email } });
        // Сделать так чтобы было непонятно неверный логин или пароль
        if (!person) {
            return next(ApiError.badRequest('Пользоатель с таким email не найден'));
        }
        let comparePassword = bcrypt.compareSync(password, person.dataValues.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('Указан неверный пароль'));
        }
        const token = generateJwt(person.dataValues.id, person.dataValues,email, person.dataValues.role);
        return res.json({ token });
    }

    async auth(req, res, next) {
        const { id, email, role } = req.person;
        const token = generateJwt(id, email, role);
        res.json({ token });
    }

    async getAll(req, res) {
        res.json('ok');
    }

    async getOne(req, res) {

    }

    async update(req, res) {

    }

    async delete(req, res) {

    }
}

export default new PersonController();


// import {pool} from "../db.js";

// class PersonController {
//     async create(req, res) {
//         const {
//             firstName, 
//             secondName, 
//             fatherName, 
//             email, 
//             phoneNumber, 
//             password
//         } = req.body;
//         const newPerson = await pool.query(
//             `INSERT INTO person (firstName, secondName, fatherName, email, phoneNumber, hashedPassword) values ($1, $2, $3, $4, $5, $6) RETURNING *`, 
//             [firstName, secondName, fatherName, email, phoneNumber, password]
//         );
//         res.json(newPerson.rows[0]);
//     }

//     async getAll(req, res) {
//         const users = await pool.query(`SELECT * FROM person`);
//         res.json(users.rows);
//     }

//     async getOne(req, res) {
//         const id = req.params.id;
//         const user = await pool.query(`SELECT * FROM person where id = $1`, [id]);
//         res.json(user.rows[0]);
//     }

//     // допилить
//     async update(req, res) {
//         const {id, firstName, secondName, fatherName, email, phoneNumber, password} = req.body;
//         const user = await pool.query(`UPDATE person set firstname = $1 where id = $2 RETURNING *`, [firstName, id]);
//         res.json(user.rows[0]);
//     }

//     async delete(req, res) {
//         const id = req.params.id;
//         const user = await pool.query(`DELETE FROM person where id = $1`, [id]);
//         res.json(user.rows[0]);
//     }
// }

// export default new PersonController();