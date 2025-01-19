const express = require("express");
const router = express.Router();
const { Shops, CurrentShop } = require("../db/db");
const updateLastModified = require("../utils/lastModified");

router.get("/", async (req, res) => {
  const currentShop = await CurrentShop.findByPk(1);
  if (!currentShop || currentShop.shop_id === null) {
    return res.json({
      shop_id: null,
      name: null,
      logo: null,
    });
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
    return res.status(400).send({ message: "Shop ID is required" });
  }
  if ((await Shops.findByPk(shop_id)) === null) {
    return res.status(404).send({ message: "Shop not found" });
  }

  await CurrentShop.destroy({ where: {} });
  await CurrentShop.create({ shop_id });
  res.status(204).send();
  await updateLastModified("current_shop");
});

module.exports = router;
