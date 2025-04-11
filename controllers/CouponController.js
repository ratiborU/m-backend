// import CouponService from "../services/CouponService.js";
import CouponService from "../services/CouponService.js";
import jwt from "jsonwebtoken";

class CouponController {
  async create(req, res) {
    try {
      const answer = await CouponService.create(req.body);
      return res.json(answer);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req, res) {
    try {
      const answers = await CouponService.getAll();
      return res.json(answers);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const answer = await CouponService.getOne(id);
      return res.json(answer);
    } catch (error) {
      next(error);
    }
  }

  async check(req, res) {
    try {
      const { value } = req.query;
      if (req.headers.authorization) {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
        const answer = await CouponService.check(value, decoded.id);
        return res.json(answer);
      } else {
        const answer = await CouponService.check(value);
        return res.json(answer);
      }

    } catch (error) {
      next(error);
    }
  }

  async update(req, res) {
    try {
      const answer = await CouponService.update(req.body);
      return res.json(answer);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const answer = await CouponService.delete(id);
      return res.json(answer);
    } catch (error) {
      next(error);
    }
  }
}

export default new CouponController();