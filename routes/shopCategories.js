const express = require("express");
const router = express.Router({ mergeParams: true });
const { Categories, Shops, ShopCategories } = require("../db/db");
const updateLastModified = require("../utils/lastModified");

router.get("/", async (req, res, next) => {
  try {
    const shop = await Shops.findByPk(req.params.id);
    if (!shop) {
      return res.status(404).send({ message: "Shop not found" });
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
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const shop = await Shops.findByPk(req.params.id);
    if (!shop) {
      return res.status(404).send({ message: "Shop not found" });
    }
    const shopCategories = req.body;
    if (!Array.isArray(shopCategories)) {
      return res
        .status(400)
        .send({ message: "Array of categories is required" });
    }
    if (!shopCategories || shopCategories.length === 0) {
      await ShopCategories.destroy({
        where: {
          shop_id: req.params.id,
        },
      });
      await updateLastModified("shop_categories");
      return res.status(204).send();
    }
    for (const shopCategory of shopCategories) {
      if (!shopCategory.category || !shopCategory.category.id) {
        return res.status(400).send({ message: "Category ID is required" });
      }
      if (!shopCategory.category_order) {
        return res.status(400).send({ message: "Category order is required" });
      }
      if ((await Categories.findByPk(shopCategory.category.id)) === null) {
        return res.status(404).send({
          message: `Category with ID ${shopCategory.category.id} not found`,
        });
      }
      if (
        shopCategories.filter(
          (sc) => sc.category.id === shopCategory.category.id,
        ).length > 1
      ) {
        return res.status(400).send({
          message: `Category with ID ${shopCategory.category.id} is duplicated`,
        });
      }
    }
    await ShopCategories.destroy({
      where: {
        shop_id: req.params.id,
      },
    });
    for (const shopCategory of shopCategories) {
      await ShopCategories.create({
        shop_id: req.params.id,
        category_id: shopCategory.category.id,
        category_order: shopCategory.category_order,
      });
    }
    res.status(204).send();
    await updateLastModified("shop_categories");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
