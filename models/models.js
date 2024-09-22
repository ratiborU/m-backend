import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

const Person = sequelize.define('person', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstName: {type: DataTypes.STRING, allowNull: false},
    secondName: {type: DataTypes.STRING, allowNull: false},
    fatherName: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    phoneNumber: {type: DataTypes.STRING}, // сделать уникальным или вообще убрать
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "PERSON"},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING},
});

// возможно нужно добавить ссылку на главное изображение товара
const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    characteristics: {type: DataTypes.STRING},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rate: {type: DataTypes.FLOAT},
    commentsCount: {type: DataTypes.INTEGER},
});

const Image = sequelize.define('image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    path: {type: DataTypes.STRING},
    // productId: {type: DataTypes.STRING},
});

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING},
    rate: {type: DataTypes.INTEGER, allowNull: false},
    // date: {type: DataTypes.DATE, allowNull: false},
    // personId: {type: DataTypes.STRING},
    // productId: {type: DataTypes.STRING},
});

const Answer = sequelize.define('answer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING, allowNull: false},
    // date: {type: DataTypes.DATE, allowNull: false},
    // personId: {type: DataTypes.STRING},
    // commentId: {type: DataTypes.STRING},
});

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    price: {type: DataTypes.INTEGER, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    // date: {type: DataTypes.DATE, allowNull: false},
    comment: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING, allowNull: false},
    // personId: {type: DataTypes.STRING},
});

const OrderProduct = sequelize.define('order_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},    
    // productId: {type: DataTypes.STRING},
    // orderId: {type: DataTypes.STRING},
    count: {type: DataTypes.INTEGER},
});

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},    
    inOrder: {type: DataTypes.BOOLEAN, defaultValue: true},
    count: {type: DataTypes.INTEGER, defaultValue: 1},
    // productId: {type: DataTypes.STRING},
    // personId: {type: DataTypes.STRING},
});

const FavoriteProduct = sequelize.define('favorite_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},    
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

// Comment
Comment.hasMany(Answer);
Answer.belongsTo(Comment);

// Order
Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Comment);

export { 
    Person, 
    Product, 
    Image, 
    Comment, 
    Answer, 
    Order, 
    OrderProduct, 
    BasketProduct, 
    FavoriteProduct 
};

