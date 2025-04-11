import { Coupon, UsedCoupon } from "../models/models.js";

class CouponService {
  async create(params) {
    const { value, discount, text, minPrice, maxDiscount, personId, productId } = params;
    const coupon = await Coupon.create({
      value,
      text,
      discount,
      minPrice,
      maxDiscount,
      personId,
      productId,
    })
    return coupon;
  }

  async getAll() {
    const coupons = await Coupon.findAll();
    return coupons;
  }

  async getOne(id) {
    const coupon = Coupon.findByPk(id);
    return coupon;
  }

  // провить на то использовали ли его ранее
  async check(value, personId) {
    console.log(value, personId);
    const coupon = await Coupon.findOne({ where: { value } });
    console.log(coupon);
    if (coupon === null) {
      return null
    }
    const usedCoupon = await UsedCoupon.findOne({ where: { couponId: coupon.dataValues.id, personId } })
    console.log(usedCoupon);
    if (usedCoupon !== null) {
      return null
    }
    return coupon;
    return null
  }

  async update(params) {
    const { id, discount, minPrice, maxDiscount, personId, productId } = params;
    const coupon = await Coupon.findByPk(id);
    await Coupon.update({
      value: value || coupon.dataValues.value,
      text: text || coupon.dataValues.text,
      discount: discount || coupon.dataValues.discount,
      minPrice: minPrice || coupon.dataValues.minPrice,
      maxDiscount: maxDiscount || coupon.dataValues.maxDiscount,
      personId: personId || coupon.dataValues.personId,
      productId: productId || coupon.dataValues.productId,
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