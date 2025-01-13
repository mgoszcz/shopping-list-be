const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const storagePath = path.resolve(__dirname, "./database.sqlite");

// SQLite example
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  host: "localhost",
  logging: console.log,
});

const Shops = sequelize.define("Shops", {
  name: { type: DataTypes.STRING, allowNull: false },
  logo: { type: DataTypes.STRING, allowNull: false },
});

const Categories = sequelize.define("Categories", {
  name: { type: DataTypes.STRING, allowNull: false },
});

const ShoppingArticles = sequelize.define("ShoppingArticles", {
  name: { type: DataTypes.STRING, allowNull: false },
  selection: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const ShoppingCart = sequelize.define(
  "ShoppingCart",
  {
    article_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    checked: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "ShoppingCart",
  },
);

const ShopCategories = sequelize.define("ShopCategories", {
  category_order: { type: DataTypes.INTEGER, allowNull: false },
});

const CurrentShop = sequelize.define(
  "CurrentShop",
  {
    shop_id: { type: DataTypes.INTEGER, allowNull: true, onDelete: "SET NULL" },
    id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  },
  {
    tableName: "CurrentShop",
  },
);

const LastModified = sequelize.define(
  "LastModified",
  {
    last_modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    table_name: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  },
  {
    tableName: "LastModified",
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

// Sync database
(async () => {
  await sequelize.sync();
})();

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
