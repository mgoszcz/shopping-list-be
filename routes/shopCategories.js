const express = require("express");
const router = express.Router({ mergeParams: true });
const { Categories, Shops, ShopCategories } = require("../db/db");

router.get("/", async (req, res) => {
  const shop = await Shops.findByPk(req.params.id);
  console.log(req.params.id);
  if (!shop) {
    return res.status(404).send("Shop not found");
  }
  const shopCategories = await ShopCategories.findAll({
    where: {
      shop_id: req.params.id,
    },
  });
  const sortedCategories = shopCategories.sort(
    (a, b) => a.category_order - b.category_order,
  );
  const transformedShopCategories = [];
  for (const shopCategory of sortedCategories) {
    const category = await Categories.findByPk(shopCategory.category_id);
    transformedShopCategories.push({
      category: {
        id: category.id,
        name: category.name,
      },
      category_order: shopCategory.category_order,
    });
  }
  res.json(transformedShopCategories);
});

module.exports = router;
