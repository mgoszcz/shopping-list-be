const {
  sequelize,
  ShoppingArticles,
  Categories,
  ShopCategories,
  Shops,
  ShoppingCart,
  CurrentShop,
} = require("./db");
const jsonData = require("./backup.json");

(async () => {
  await sequelize.sync({ force: true });
  console.log("Database synced");

  for (const category of jsonData.shopping_list.categories) {
    await Categories.create({ name: category });
  }

  for (const article of jsonData.shopping_list.shopping_articles_list) {
    const categoryID = (
      await Categories.findOne({ where: { name: article.category } })
    ).id;
    console.log(categoryID);
    await ShoppingArticles.create({
      name: article.name,
      selection: article.selection,
      category_id: (
        await Categories.findOne({ where: { name: article.category } })
      ).id,
    });
  }

  for (const shop of jsonData.shopping_list.shops) {
    await Shops.create({
      name: shop.name,
      logo: shop.logo,
    });
    let order = 1;
    for (const category of shop.category_list) {
      await ShopCategories.create({
        category_order: order,
        shop_id: (await Shops.findOne({ where: { name: shop.name } })).id,
        category_id: (await Categories.findOne({ where: { name: category } }))
          .id,
      });
      order++;
    }
  }

  for (const shoppingCartItem of jsonData.shopping_list.shopping_list) {
    await ShoppingCart.create({
      article_id: (
        await ShoppingArticles.findOne({
          where: { name: shoppingCartItem.article_name },
        })
      ).id,
      quantity: shoppingCartItem.amount,
      checked: shoppingCartItem.checked,
    });
  }

  if (jsonData.shopping_list.current_shop) {
    await CurrentShop.create({
      shop_id: (
        await Shops.findOne({
          where: { name: jsonData.shopping_list.current_shop },
        })
      ).id,
    });
  }

  console.log("Data loaded");
  process.exit();
})();
