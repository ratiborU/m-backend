// import UsedCouponService from "../services/UsedCouponService.js";
import UsedCouponService from "../services/UsedCouponService.js";
import jwt from "jsonwebtoken";

class UsedCouponController {
  async create(req, res) {
    try {
      const usedCoupon = await UsedCouponService.create(req.body);
      return res.json(usedCoupon);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req, res) {
    try {
      const usedCoupons = await UsedCouponService.getAll();
      return res.json(usedCoupons);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const usedCoupon = await UsedCouponService.getOne(id);
      return res.json(usedCoupon);
    } catch (error) {
      next(error);
    }
  }

  // async check(req, res) {
  //   try {
  //     const { value } = req.query;
  //     const usedCoupon = await UsedCouponService.check(value);
  //       return res.json(usedCoupon);

  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async update(req, res) {
    try {
      const usedCoupon = await UsedCouponService.update(req.body);
      return res.json(usedCoupon);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const usedCoupon = await UsedCouponService.delete(id);
      return res.json(usedCoupon);
    } catch (error) {
      next(error);
    }
  }
}

export default new UsedCouponController();