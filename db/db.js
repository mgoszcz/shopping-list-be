const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const storagePath = path.resolve(__dirname, "./database.sqlite");

// SQLite example
const sequelize = new Sequelize("shoppingList", "Gosz375781", "", {
  host: "localhost", // or the cloud database host
  dialect: "postgres",
});

const Shops = sequelize.define(
  "shops",
  {
    name: { type: DataTypes.TEXT, allowNull: false },
    logo: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    tableName: "shops",
  },
);

const Categories = sequelize.define(
  "categories",
  {
    name: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    tableName: "categories",
  },
);

const ShoppingArticles = sequelize.define(
  "shopping_articles",
  {
    name: { type: DataTypes.TEXT, allowNull: false },
    selection: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    tableName: "shopping_articles",
  },
);

const ShoppingCart = sequelize.define(
  "shopping_cart",
  {
    article_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    checked: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "shopping_cart",
  },
);

const ShopCategories = sequelize.define(
  "shop_categories",
  {
    category_order: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "shop_categories",
  },
);

const CurrentShop = sequelize.define(
  "current_shop",
  {
    shop_id: { type: DataTypes.INTEGER, allowNull: true, onDelete: "SET NULL" },
    id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  },
  {
    tableName: "current_shop",
  },
);

const LastModified = sequelize.define(
  "last_modified",
  {
    last_modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    table_name: { type: DataTypes.TEXT, allowNull: false, primaryKey: true },
  },
  {
    tableName: "last_modified",
  },
);

// Associations
ShoppingArticles.belongsTo(Categories, { foreignKey: "category_id" });
ShoppingCart.belongsTo(ShoppingArticles, { foreignKey: "article_id" });
ShopCategories.belongsTo(Shops, { foreignKey: "shop_id" });
ShopCategories.belongsTo(Categories, { foreignKey: "category_id" });
Shops.belongsToMany(Categories, {
  through: ShopCategories,
  foreignKey: "shop_id",
});
Categories.belongsToMany(Shops, {
  through: ShopCategories,
  foreignKey: "category_id",
});
CurrentShop.belongsTo(Shops, { foreignKey: "shop_id" });

module.exports = {
  sequelize,
  ShoppingArticles,
  Categories,
  ShoppingCart,
  Shops,
  ShopCategories,
  CurrentShop,
  LastModified,
};
