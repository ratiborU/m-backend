import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import fileUpload from "express-fileupload";
import path from "path";
import cookieParser from "cookie-parser";
import { sequelize } from "./db.js";
import { router } from "./routers/index.js";
import { errorHandler } from "./middleware/ErrorHandlingMiddleware.js";
import {
  Person,
  Product,
  Image,
  Comment,
  Answer,
  Order,
  OrderProduct,
  BasketProduct,
  FavoriteProduct
} from "./models/models.js";
// import { YooCheckout } from '@a2seven/yoo-checkout';


dotenv.config();
const PORT = process.env.PORT || 5000;


const app = express();
// app.options('*', cors())
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve('static')));
app.use(fileUpload({}));
app.use('/api', router);

// самый последний
app.use(errorHandler);

// const YooKassa = new YooCheckout({
//   shopId: '1055221',
//   // вынести в env !!!
//   secretKey: 'test_gekjRStM_JZNuRFEW7zZvpNugurxuKyrFQXJ9uvYqAE'
// });


const start = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync();
    // await sequelize.sync({ force: true });  // удаляет существующую таблицу и создает новую
    // await sequelize.sync({ alter: true }); // приводит таблицу в соответствие с моделью
    app.listen(PORT, () => console.log('server started on port ' + PORT))
  } catch (error) {
    console.log(error);
  }
}

start();

