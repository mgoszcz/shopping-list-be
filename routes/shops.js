const express = require("express");
const router = express.Router();
const { Shops, CurrentShop, ShopCategories } = require("../db/db");
const { Op } = require("sequelize");
const updateLastModified = require("../utils/lastModified");

router.get("/", async (req, res, next) => {
  try {
    const shops = await Shops.findAll();
    const transformedShops = shops.map((shop) => {
      return {
        id: shop.id,
        name: shop.name,
        logo: shop.logo,
      };
    });
    res.json(transformedShops);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const shop = await Shops.findByPk(req.params.id);
    if (!shop) {
      res.status(404).send({ message: "Shop not found" });
    } else {
      res.json(shop);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, logo } = req.body;
    if (!name || !logo) {
      return res.status(400).send({ message: "Name and logo is required" });
    }
    if ((await Shops.findOne({ where: { name } })) !== null) {
      return res.status(409).send({ message: "Shop already exists" });
    }
    const shop = await Shops.create(req.body);
    res.status(201).json(shop);
    await updateLastModified("shops");
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const shop = await Shops.findByPk(req.params.id);
    const { name, logo } = req.body;
    if (!name || !logo) {
      return res.status(400).send({ message: "Name and logo is required" });
    }
    if (!shop) {
      if ((await Shops.findOne({ where: { name } })) !== null) {
        return res.status(409).send({ message: "Shop already exists" });
      }
      const shop = await Shops.create(req.body);
      res.status(201).json(shop);
    } else {
      if (
        (await Shops.findOne({ where: { name, id: { [Op.ne]: shop.id } } })) !==
        null
      ) {
        return res.status(409).send({ message: "Shop already exists" });
      }
      shop.name = name;
      shop.logo = logo;
      await shop.save();
      res.status(204).send();
    }
    await updateLastModified("shops");
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const shopId = req.params.id;
    const shop = await Shops.findByPk(shopId);
    if (!shop) {
      return res.status(404).send({ message: "Shop not found" });
    }
    if (
      (await ShopCategories.findOne({ where: { shop_id: shopId } })) !== null
    ) {
      await ShopCategories.destroy({ where: { shop_id: shopId } });
      await updateLastModified("shop_categories");
    }
    if ((await CurrentShop.findOne({ where: { shop_id: shopId } })) !== null) {
      await CurrentShop.destroy({ where: { id: 1 } });
      await updateLastModified("current_shop");
    }
    await shop.destroy();
    res.status(204).send();
    await updateLastModified("shops");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
