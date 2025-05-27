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
  // isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// возможно нужно добавить ссылку на главное изображение товара
const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  description: { type: DataTypes.STRING(2047), allowNull: false, defaultValue: '' },
  seoTitle: { type: DataTypes.STRING, defaultValue: '', allowNull: true },
  seoDescription: { type: DataTypes.STRING, defaultValue: '', allowNull: true },
  characteristics: { type: DataTypes.STRING },
  categoryCharacteristics: { type: DataTypes.JSON, defaultValue: {} },
  price: { type: DataTypes.INTEGER, defaultValue: 0 },
  discount: { type: DataTypes.INTEGER, defaultValue: 0 },
  rate: { type: DataTypes.FLOAT, defaultValue: 0 },
  commentsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  productsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  mainImage: { type: DataTypes.STRING, allowNull: true },
  // stone: { type: DataTypes.STRING },
  // size: { type: DataTypes.STRING },
  // material: { type: DataTypes.STRING },
  // fasteningType: { type: DataTypes.STRING },
  // amount: { type: DataTypes.INTEGER, defaultValue: 12 },
  sellCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  inOrdersCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  skladCharacteristics: { type: DataTypes.JSON },
  // categoryId: {type: DataTypes.STRING},
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  parameters: { type: DataTypes.JSON, allowNull: true },
});

const Image = sequelize.define('image', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  path: { type: DataTypes.STRING },
  // productId: {type: DataTypes.STRING},
});

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.STRING(1023) },
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
  price: { type: DataTypes.INTEGER, defaultValue: 0 },
  address: { type: DataTypes.STRING, defaultValue: '' },
  delivery: { type: DataTypes.STRING, defaultValue: 'cdek' },
  deliveryDays: { type: DataTypes.STRING, defaultValue: '7' },
  comment: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'В обработке' },
  skladCharacteristics: { type: DataTypes.JSON, defaultValue: {} },
  youKassaCharacteristics: { type: DataTypes.JSON, defaultValue: {} },
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

const Coupon = sequelize.define('coupon', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.STRING, defaultValue: "ninamed10" },
  text: { type: DataTypes.STRING, allowNull: true, },
  discount: { type: DataTypes.STRING, defaultValue: "10%" },
  minPrice: { type: DataTypes.INTEGER, defaultValue: 0 },
  maxDiscount: { type: DataTypes.STRING, defaultValue: "30%" },
  isOnceOnly: { type: DataTypes.BOOLEAN, defaultValue: false },
  // productId: {type: DataTypes.STRING},
  // personId: {type: DataTypes.STRING},
});

const UsedCoupon = sequelize.define('used_coupon', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  // productId: {type: DataTypes.STRING},
  // personId: {type: DataTypes.STRING},
});

const ProductHistory = sequelize.define('product_history', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  count: { type: DataTypes.INTEGER, defaultValue: 0 },
  inOrderCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  viewsCount: { type: DataTypes.INTEGER, defaultValue: 1 },
  isInFavorite: { type: DataTypes.BOOLEAN, defaultValue: false },
  rate: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: true },
  // recomendationK: { type: DataTypes.INTEGER, defaultValue: 0 },
  // productId: {type: DataTypes.STRING},
  // personId: {type: DataTypes.STRING},
});

const Loyal = sequelize.define('loyal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  points: { type: DataTypes.INTEGER, defaultValue: 0 }, // points count
  cashback: { type: DataTypes.INTEGER, defaultValue: 2 }, // 2 or 5%
  total: { type: DataTypes.INTEGER, defaultValue: 0 }, // total spend 5% from 50 000
  // personId: {type: DataTypes.STRING},
});

const ProductTFIDF = sequelize.define('product_tfidf', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tfidfs: { type: DataTypes.ARRAY(DataTypes.JSON) },
  // productId: {type: DataTypes.STRING},
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
Comment.hasOne(Answer);
Answer.belongsTo(Comment);


// Order
Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order);


// Coupon
Person.hasMany(Coupon);
Coupon.belongsTo(Person);

Product.hasMany(Coupon);
Coupon.belongsTo(Product);


// UsedCoupon
Coupon.hasMany(UsedCoupon);
UsedCoupon.belongsTo(Coupon);

Person.hasMany(UsedCoupon);
UsedCoupon.belongsTo(Person);


// ProductHistory
Person.hasMany(ProductHistory);
ProductHistory.belongsTo(Person);

Product.hasMany(ProductHistory);
ProductHistory.belongsTo(Product);

// Loyal
Person.hasOne(Loyal);
Loyal.belongsTo(Person);

// ProductTFIDF
Product.hasOne(ProductTFIDF);
ProductTFIDF.belongsTo(Product);

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
  FavoriteProduct,
  Coupon,
  UsedCoupon,
  ProductHistory,
  Loyal,
  ProductTFIDF
};

