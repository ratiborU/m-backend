import { Loyal } from "../models/models.js";

class LoyalService {
  async create(params) {
    const { points = 0, cashback = 2, total = 0, personId } = params;
    const loyal = await Loyal.create({ points, cashback, total, personId });
    return loyal;
  }

  async getAll() {
    const loyals = await Loyal.findAll({});
    return loyals;
  }

  async getOneByPersonId(personId) {
    const loyal = await Loyal.findOne({ where: { personId } });
    return loyal;
  }

  async getOne(id) {
    const loyal = Loyal.findByPk(id);
    return loyal;
  }

  async update(params) {
    const { id, points, cashback, total, personId } = params;
    await Loyal.update(
      { points, cashback, total, personId },
      { where: { id } }
    );
    const updatedLoyal = await Loyal.findByPk(id);
    return updatedLoyal;
  }

  async update(params) {
    const { id, points, cashback, total, personId } = params;
    await Loyal.update(
      { points, cashback, total, personId },
      { where: { id } }
    );
    const updatedLoyal = await Loyal.findByPk(id);
    return updatedLoyal;
  }

  async addPoints(personId, pointsAdd) {
    const loyal = await Loyal.findOne({ where: { personId } });
    // console.log(loyal);
    await Loyal.update(
      { points: loyal.dataValues.points + pointsAdd },
      { where: { personId } }
    );
    const updatedLoyal = await Loyal.findOne({ where: { personId } });
    return updatedLoyal;
  }

  async addTotal(personId, addTotal) {
    const loyal = await Loyal.findOne({ where: { personId } });
    if (loyal.dataValues.total + addTotal >= 50000) {
      console.log(Number(loyal.dataValues.total) + Number(addTotal));
      await Loyal.update(
        { total: Number(loyal.dataValues.total) + Number(addTotal), cashback: 5 },
        { where: { personId } }
      );
      console.log('hola u u');
    } else {
      console.log('hola u2');
      await Loyal.update(
        { total: Number(loyal.dataValues.total) + Number(addTotal) },
        { where: { personId } }
      );
    }

    const updatedLoyal = await Loyal.findOne({ where: { personId } });
    return updatedLoyal;
  }

  async removePoints(personId, pointsRemove) {
    const loyal = await Loyal.findOne({ where: { personId } });
    await Loyal.update(
      { points: loyal.dataValues.points - pointsRemove },
      { where: { personId } }
    );
    const updatedLoyal = await Loyal.findOne({ where: { personId } });
    return updatedLoyal;
  }

  async delete(id) {
    const loyal = await Loyal.destroy({ where: { id } });
    return loyal;
  }
}

export default new LoyalService;