const express = require("express");
const router = express.Router();
const { ShoppingArticles, Categories, ShoppingCart } = require("../db/db");

router.get("/", async (req, res) => {
  const shoppingCartItems = await ShoppingCart.findAll();
  const transformedShoppingCartItems = [];
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

  res.json(transformedShoppingCartItems);
});

module.exports = router;
