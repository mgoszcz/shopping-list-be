const express = require("express");
const router = express.Router();
const { Shops, CurrentShop } = require("../db/db");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  const shops = await Shops.findAll();
  const transformedShops = shops.map((shop) => {
    return {
      id: shop.id,
      name: shop.name,
      logo: shop.logo,
    };
  });
  res.json(transformedShops);
});

router.get("/:id", async (req, res) => {
  const shop = await Shops.findByPk(req.params.id);
  if (!shop) {
    res.status(404).send("Shop not found");
  } else {
    res.json(shop);
  }
});

router.post("/", async (req, res) => {
  const { name, logo } = req.body;
  if (!name || !logo) {
    return res.status(400).send("Name and logo is required");
  }
  if ((await Shops.findOne({ where: { name } })) !== null) {
    return res.status(409).send("Shop already exists");
  }
  const shop = await Shops.create(req.body);
  res.status(201).json(shop);
});

router.put("/:id", async (req, res) => {
  const shop = await Shops.findByPk(req.params.id);
  const { name, logo } = req.body;
  if (!name || !logo) {
    return res.status(400).send("Name and logo is required");
  }
  if (!shop) {
    if ((await Shops.findOne({ where: { name } })) !== null) {
      return res.status(409).send("Shop already exists");
    }
    const shop = await Shops.create(req.body);
    res.status(201).json(shop);
  } else {
    if (
      (await Shops.findOne({ where: { name, id: { [Op.ne]: shop.id } } })) !==
      null
    ) {
      return res.status(409).send("Shop already exists");
    }
    shop.name = name;
    shop.logo = logo;
    await shop.save();
    res.status(204).send();
  }
});

router.delete("/:id", async (req, res) => {
  const shopId = req.params.id;
  const shop = await Shops.findByPk(shopId);
  if (!shop) {
    return res.status(404).send("Shop not found");
  }
  await shop.destroy();
  if ((await CurrentShop.findByPk(1).shop_id) === shopId) {
    await CurrentShop.destroy({ where: { id: 1 } });
  }
  res.status(204).send();
});

module.exports = router;
