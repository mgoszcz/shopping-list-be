const express = require("express");
const router = express.Router();
const { Shops, CurrentShop } = require("../db/db");

router.get("/", async (req, res) => {
  const currentShop = await CurrentShop.findByPk(1);
  if (!currentShop || currentShop.shop_id === null) {
    return res.status(204).send();
  }
  const shop = await Shops.findByPk(currentShop.shop_id);
  const transformedCurrentShop = {
    shop_id: currentShop.shop_id,
    name: shop.name,
    logo: shop.logo,
  };
  res.json(transformedCurrentShop);
});

router.put("/", async (req, res) => {
  const { shop_id } = req.body;
  if (!shop_id) {
    return res.status(400).send("Shop ID is required");
  }
  if ((await Shops.findByPk(shop_id)) === null) {
    return res.status(404).send("Shop not found");
  }

  await CurrentShop.destroy({ where: {} });
  await CurrentShop.create({ shop_id });
  res.status(204).send();
});

module.exports = router;
