const express = require("express");
const router = express.Router();
const { Categories, Shops } = require("../db/db");

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

module.exports = router;
