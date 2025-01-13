const {
  sequelize,
  Shops,
  Categories,
  ShoppingArticles,
  ShoppingCart,
  CurrentShop,
  ShopCategories,
} = require("../../db/db");
const updateLastModified = require("../../utils/lastModified");

async function seedDatabase() {
  await sequelize.sync({ force: true }); // Recreate tables

  // Create categories
  const category1 = await Categories.create({ name: "beta" });
  const category2 = await Categories.create({ name: "gamma" });
  const category3 = await Categories.create({ name: "alpha" });
  await updateLastModified("Categories");

  // Create Shops
  const shop1 = await Shops.create({ name: "Shop 1", logo: "logo1.jpg" });
  const shop2 = await Shops.create({ name: "Shop 2", logo: "logo2.jpg" });
  const shop3 = await Shops.create({ name: "Shop 3", logo: "logo2.jpg" });
  await updateLastModified("Shops");

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
  await updateLastModified("ShopCategories");

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
  await updateLastModified("ShoppingArticles");

  // add items to cart
  await ShoppingCart.create({ article_id: 3, quantity: 2, checked: true });
  await ShoppingCart.create({ article_id: 4, quantity: 1, checked: false });
  await ShoppingCart.create({ article_id: 1, quantity: 1, checked: false });

  // set current shop
  await CurrentShop.create({ shop_id: 1 });
  await updateLastModified("CurrentShop");
}

seedDatabase();
