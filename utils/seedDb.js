const {
  Shops,
  Categories,
  ShoppingArticles,
  ShoppingCart,
  CurrentShop,
  ShopCategories,
  LastModified,
} = require("../db/db");
const updateLastModified = require("./lastModified");

async function seedDatabase() {
  await CurrentShop.sync({ force: true });
  await ShoppingCart.sync({ force: true });
  await ShoppingArticles.sync({ force: true });
  await ShopCategories.sync({ force: true });
  await Shops.sync({ force: true });
  await Categories.sync({ force: true });
  await LastModified.sync({ force: true });

  console.log("Create categories");
  // Create categories
  const category1 = await Categories.create({ name: "beta" });
  const category2 = await Categories.create({ name: "gamma" });
  const category3 = await Categories.create({ name: "alpha" });
  await updateLastModified("categories");

  console.log("Create shops");
  // Create Shops
  const shop1 = await Shops.create({ name: "Shop 1", logo: "logo1.jpg" });
  const shop2 = await Shops.create({ name: "Shop 2", logo: "logo2.jpg" });
  const shop3 = await Shops.create({ name: "Shop 3", logo: "logo2.jpg" });
  await updateLastModified("shops");

  console.log("Create shop categories");
  // Create category lists for shops
  await ShopCategories.create({
    shop_id: shop1.id,
    category_id: category2.id,
    category_order: 1,
  });
  await ShopCategories.create({
    shop_id: shop1.id,
    category_id: category1.id,
    category_order: 2,
  });
  await ShopCategories.create({
    shop_id: shop1.id,
    category_id: category3.id,
    category_order: 3,
  });
  await ShopCategories.create({
    shop_id: shop2.id,
    category_id: category3.id,
    category_order: 1,
  });
  await ShopCategories.create({
    shop_id: shop2.id,
    category_id: category2.id,
    category_order: 2,
  });
  await updateLastModified("shop_categories");

  console.log("Create shopping articles");
  // add articles
  await ShoppingArticles.create({
    name: "HH first article",
    category_id: category3.id,
  });
  await ShoppingArticles.create({
    name: "AA second article",
    category_id: category2.id,
  });
  await ShoppingArticles.create({
    name: "ZZ third article",
    category_id: category1.id,
  });
  await ShoppingArticles.create({
    name: "XX fourth article",
    category_id: category2.id,
  });
  await updateLastModified("shopping_articles");

  console.log("Create shopping cart");
  // add items to cart
  await ShoppingCart.create({ article_id: 3, quantity: 2, checked: true });
  await ShoppingCart.create({ article_id: 4, quantity: 1, checked: false });
  await ShoppingCart.create({ article_id: 1, quantity: 1, checked: false });

  console.log("Create current shop");
  // set current shop
  await CurrentShop.create({ shop_id: 1 });
  await updateLastModified("current_shop");

  console.log("Database seeded");
}

async function clearDb() {
  await CurrentShop.sync({ force: true });
  await ShoppingCart.sync({ force: true });
  await ShoppingArticles.sync({ force: true });
  await ShopCategories.sync({ force: true });
  await Shops.sync({ force: true });
  await Categories.sync({ force: true });
  await LastModified.sync({ force: true });
}

module.exports = { seedDatabase, clearDb };
