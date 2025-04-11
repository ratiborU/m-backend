import { UsedCoupon } from "../models/models.js";

class UsedCouponService {
  async create(params) {
    const { personId, productId, couponId } = params;
    const usedCoupon = await UsedCoupon.create({
      couponId,
      personId,
      // productId,
    })
    return usedCoupon;
  }

  async getAll() {
    const usedCoupons = await UsedCoupon.findAll();
    return usedCoupons;
  }

  async getOne(id) {
    const usedCoupon = UsedCoupon.findByPk(id);
    return usedCoupon;
  }

  async update(params) {
    const { id, personId, couponId } = params;
    const usedCoupon = await UsedCoupon.findByPk(id);
    await UsedCoupon.update({
      couponId: couponId || usedCoupon.dataValues.couponId,
      personId: personId || usedCoupon.dataValues.personId,
    }, {
      where: { id }
    });
    const updatedUsedCoupon = await UsedCoupon.findByPk(id);
    return updatedUsedCoupon;
  }

  async delete(id) {
    const usedCoupon = await UsedCoupon.destroy({ where: { id } });
    return usedCoupon;
  }
}

export default new UsedCouponService;