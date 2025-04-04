import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

// paranoid: true

const Person = sequelize.define('person', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  secondName: { type: DataTypes.STRING, allowNull: false },
  fatherName: { type: DataTypes.STRING },
  // email: { type: DataTypes.STRING, unique: true, allowNull: false },
  // phoneNumber: { type: DataTypes.STRING, unique: true }, // сделать уникальным или вообще убрать
  email: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "PERSON" },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.STRING },
  isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// возможно нужно добавить ссылку на главное изображение товара
const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  seoTitle: { type: DataTypes.STRING, allowNull: true },
  seoDescription: { type: DataTypes.STRING, allowNull: true },
  characteristics: { type: DataTypes.STRING },
  price: { type: DataTypes.INTEGER, allowNull: false },
  discount: { type: DataTypes.INTEGER, allowNull: true },
  rate: { type: DataTypes.FLOAT },
  commentsCount: { type: DataTypes.INTEGER },
  productsCount: { type: DataTypes.INTEGER },
  mainImage: { type: DataTypes.STRING, allowNull: true },
  stone: { type: DataTypes.STRING },
  size: { type: DataTypes.STRING },
  material: { type: DataTypes.STRING },
  fasteningType: { type: DataTypes.STRING },
  amount: { type: DataTypes.INTEGER, defaultValue: 12 },
  // categoryId: {type: DataTypes.STRING},
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const Image = sequelize.define('image', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  path: { type: DataTypes.STRING },
  // productId: {type: DataTypes.STRING},
});

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING },
  rate: { type: DataTypes.INTEGER, allowNull: false },
  // date: {type: DataTypes.DATE, allowNull: false},
  // personId: {type: DataTypes.STRING},
  // productId: {type: DataTypes.STRING},
});

const Answer = sequelize.define('answer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING, allowNull: false },
  // date: {type: DataTypes.DATE, allowNull: false},
  // personId: {type: DataTypes.STRING},
  // commentId: {type: DataTypes.STRING},
});

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  price: { type: DataTypes.INTEGER, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  delivery: { type: DataTypes.STRING, allowNull: false },
  deliveryDays: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, allowNull: false },
  // date: {type: DataTypes.DATE, allowNull: false},
  // personId: {type: DataTypes.STRING},
});

const OrderProduct = sequelize.define('order_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // productId: {type: DataTypes.STRING},
  // orderId: {type: DataTypes.STRING},
  count: { type: DataTypes.INTEGER },
});

const BasketProduct = sequelize.define('basket_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  inOrder: { type: DataTypes.BOOLEAN, defaultValue: true },
  count: { type: DataTypes.INTEGER, defaultValue: 1 },
  // productId: {type: DataTypes.STRING},
  // personId: {type: DataTypes.STRING},
});

const FavoriteProduct = sequelize.define('favorite_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // productId: {type: DataTypes.STRING},
  // personId: {type: DataTypes.STRING},
});

// Product
Product.hasMany(Image);
Image.belongsTo(Product);

Product.hasMany(Comment);
Comment.belongsTo(Product);

Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Product);

Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

Product.hasMany(FavoriteProduct);
FavoriteProduct.belongsTo(Product);

// Person
Person.hasMany(Comment);
Comment.belongsTo(Person);

Person.hasMany(Comment);
Comment.belongsTo(Person);

Person.hasMany(Answer);
Answer.belongsTo(Person);

Person.hasMany(Order);
Order.belongsTo(Person);

Person.hasMany(BasketProduct);
BasketProduct.belongsTo(Person);

Person.hasMany(FavoriteProduct);
FavoriteProduct.belongsTo(Person);

// Category
Category.hasMany(Product);
Product.belongsTo(Category);

// Comment
Comment.hasMany(Answer);
Answer.belongsTo(Comment);

// Order
Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order);

export {
  Person,
  Product,
  Category,
  Image,
  Comment,
  Answer,
  Order,
  OrderProduct,
  BasketProduct,
  FavoriteProduct
};

