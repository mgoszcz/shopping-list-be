const express = require("express");
const router = express.Router();
const {
  ShoppingArticles,
  Categories,
  ShoppingCart,
  CurrentShop,
  ShopCategories,
  sequelize,
} = require("../db/db");
const updateLastModified = require("../utils/lastModified");

const sortingOrders = {
  BY_SHOP: "byShop",
  ALPHABETICALLY: "alpha",
};

router.get("/", async (req, res) => {
  const shoppingCartItems = await ShoppingCart.findAll();
  const sortingOrder = req.query.sort || sortingOrders.BY_SHOP;
  const checkedOnly = req.query.checked;
  const uncheckedOnly = req.query.unchecked;
  let transformedShoppingCartItems = [];
  for (const shoppingCartItem of shoppingCartItems) {
    const shoppingArticle = await ShoppingArticles.findByPk(
      shoppingCartItem.article_id,
    );
    transformedShoppingCartItems.push({
      id: shoppingCartItem.id,
      article: {
        id: shoppingCartItem.article_id,
        name: shoppingArticle.name,
      },
      category: {
        id: shoppingArticle.category_id,
        name: (await Categories.findByPk(shoppingArticle.category_id)).name,
      },
      quantity: shoppingCartItem.quantity,
      checked: shoppingCartItem.checked,
    });
  }
  if (sortingOrder === sortingOrders.BY_SHOP) {
    const currentShopId = (await CurrentShop.findOne())
      ? (await CurrentShop.findOne()).shop_id
      : null;
    const sortedCategories = (
      await ShopCategories.findAll({
        where: { shop_id: currentShopId },
      })
    )
      .sort((a, b) => a.category_order - b.category_order)
      .map((shopCategory) => shopCategory.category_id);
    transformedShoppingCartItems.sort((a, b) => {
      const indexA = sortedCategories.indexOf(a.category.id || -1);
      const indexB = sortedCategories.indexOf(b.category.id || -1);

      if (indexA === -1 && indexB === -1) {
        // If both are missing from predefinedOrder, sort alphabetically by category.name
        return a.article.name.localeCompare(b.article.name);
      }
      if (indexA === -1) return -1; // Missing id goes to the beginning
      if (indexB === -1) return 1; // Missing id goes to the beginning

      // Sort by predefined order
      return indexA - indexB;
    });
  } else if (sortingOrder === sortingOrders.ALPHABETICALLY) {
    transformedShoppingCartItems.sort((a, b) =>
      a.article.name.localeCompare(b.article.name),
    );
  } else {
    return res.status(400).send({ message: "Invalid sorting order" });
  }
  if (checkedOnly) {
    transformedShoppingCartItems = transformedShoppingCartItems.filter(
      (item) => item.checked,
    );
  }
  if (uncheckedOnly) {
    transformedShoppingCartItems = transformedShoppingCartItems.filter(
      (item) => !item.checked,
    );
  }
  res.json(transformedShoppingCartItems);
});

router.get("/:id", async (req, res) => {
  const shoppingCartItem = await ShoppingCart.findByPk(req.params.id);
  if (!shoppingCartItem) {
    res.status(404).send({ message: "Shopping cart item not found" });
  } else {
    const shoppingArticle = await ShoppingArticles.findByPk(
      shoppingCartItem.article_id,
    );
    const transformedItem = {
      id: shoppingCartItem.id,
      article: {
        id: shoppingArticle.id,
        name: shoppingArticle.name,
      },
      category: {
        id: shoppingArticle.category_id,
        name: (await Categories.findByPk(shoppingArticle.category_id)).name,
      },
      quantity: shoppingCartItem.quantity,
      checked: shoppingCartItem.checked,
      createdAt: shoppingCartItem.createdAt,
      updatedAt: shoppingCartItem.updatedAt,
    };
    res.json(transformedItem);
  }
});

router.post("/", async (req, res) => {
  const { article } = req.body;
  if (!article?.id) {
    return res.status(400).send({ message: "Article ID is required" });
  }
  if ((await ShoppingArticles.findByPk(article.id)) === null) {
    return res.status(404).send({ message: "Article not found" });
  }
  if (
    (await ShoppingCart.findOne({
      where: { article_id: article.id },
    })) !== null
  ) {
    return res
      .status(409)
      .send({ message: "Article already in shopping cart" });
  }
  const shoppingCartItem = await ShoppingCart.create({
    article_id: article.id,
    quantity: 1,
    checked: false,
  });
  await ShoppingArticles.increment("selection", {
    by: 1,
    where: { id: article.id },
  });
  res.status(201).json(shoppingCartItem);
  await updateLastModified("shopping_cart");
});

router.put("/:id", async (req, res) => {
  const shoppingCartItem = await ShoppingCart.findByPk(req.params.id);
  if (!shoppingCartItem) {
    return res.status(404).send({ message: "Shopping cart item not found" });
  }
  const { quantity, checked } = req.body;
  if (quantity !== undefined) {
    shoppingCartItem.quantity = quantity;
  }
  if (checked !== undefined) {
    shoppingCartItem.checked = checked;
  }
  await shoppingCartItem.save();
  res.status(204).send();
  await updateLastModified("shopping_cart");
});

router.delete("/:id", async (req, res) => {
  const shoppingCartItem = await ShoppingCart.findByPk(req.params.id);
  if (!shoppingCartItem) {
    return res.status(404).send({ message: "Shopping cart item not found" });
  }
  if (!shoppingCartItem.checked) {
    await ShoppingArticles.decrement("selection", {
      by: 1,
      where: { id: shoppingCartItem.article_id },
    });
  }
  await shoppingCartItem.destroy();
  const all_items = await ShoppingCart.findAll();
  if (all_items.length === 0) {
    await sequelize.query("ALTER SEQUENCE shopping_cart_id_seq RESTART WITH 1");
  }
  res.status(204).send();
  await updateLastModified("shopping_cart");
});

router.delete("/", async (req, res) => {
  const { checked, unchecked } = req.query;
  if (checked && unchecked) {
    return res
      .status(400)
      .send({ message: "Cannot use both checked and unchecked parameters" });
  }
  if (checked) {
    await ShoppingCart.destroy({ where: { checked: true } });
  } else if (unchecked) {
    for (const item of await ShoppingCart.findAll({
      where: { checked: false },
    })) {
      await ShoppingArticles.decrement("selection", {
        by: 1,
        where: { id: item.article_id },
      });
    }
    await ShoppingCart.destroy({ where: { checked: false } });
  } else {
    for (const item of await ShoppingCart.findAll({
      where: { checked: false },
    })) {
      await ShoppingArticles.decrement("selection", {
        by: 1,
        where: { id: item.article_id },
      });
    }
    await ShoppingCart.destroy({ where: {} });
  }
  const all_items = await ShoppingCart.findAll();
  console.log(all_items);
  if (all_items.length === 0) {
    await sequelize.query("ALTER SEQUENCE shopping_cart_id_seq RESTART WITH 1");
  }
  res.status(204).send();
  await updateLastModified("shopping_cart");
});

module.exports = router;
