// import YouKassaService from "../services/YouKassaService.js";
import YouKassaService from "../services/YouKassaService.js";

class YouKassaController {
  async createPayment(req, res) {
    try {
      // console.log(req.body);
      const youKassa = await YouKassaService.createPayment(req.body);
      return res.json(youKassa);
      // return res.json({});
    } catch (error) {
      next(error);
    }
  }

  async notification(req, res) {
    try {
      // console.log(req.body);
      const youKassa = await YouKassaService.notification(req.body);
      return res.json(youKassa);
      // return res.json({});
    } catch (error) {
      next(error);
    }
  }
}

export default new YouKassaController();