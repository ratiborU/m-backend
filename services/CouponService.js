import { Coupon, UsedCoupon, Person } from "../models/models.js";

class CouponService {
  async create(params) {
    const {
      value,
      discount,
      text,
      // minPrice,
      // maxDiscount,
      personId = null,
      productId = null
    } = params;

    const coupon = await Coupon.create({
      value,
      text,
      discount,
      // minPrice,
      // maxDiscount,
      personId: personId || null,
      productId,
    })
    return coupon;
  }

  async getAll() {
    const coupons = await Coupon.findAll({ include: Person });
    return coupons;
  }

  async getOne(id) {
    const coupon = Coupon.findByPk(id);
    return coupon;
  }

  // провить на то использовали ли его ранее
  async check(value, personId) {
    const coupon = await Coupon.findOne({ where: { value } });
    if (coupon === null) {
      return null
    }
    const usedCoupon = await UsedCoupon.findOne(
      {
        where: {
          couponId: coupon.dataValues.id,
          personId
        }
      }
    )
    if (usedCoupon !== null) {
      return null
    }
    return coupon;
    return null
  }

  async update(params) {
    const { id, value, text, discount, minPrice, maxDiscount, personId, productId } = params;
    const coupon = await Coupon.findByPk(id);
    await Coupon.update({
      value,
      text,
      discount,
      personId: Number(personId),
    }, {
      where: { id }
    });
    const updatedCoupon = await Coupon.findByPk(id);
    return updatedCoupon;
  }

  async delete(id) {
    const coupon = await Coupon.destroy({ where: { id } });
    return coupon;
  }
}

export default new CouponService;