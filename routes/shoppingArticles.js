const express = require("express");
const router = express.Router();
const { ShoppingArticles, Categories } = require("../db/db");

router.get("/", async (req, res) => {
  const shoppingArticles = await ShoppingArticles.findAll();
  const transformedShoppingArticles = [];
  for (const shoppingArticle of shoppingArticles) {
    transformedShoppingArticles.push({
      id: shoppingArticle.id,
      name: shoppingArticle.name,
      selection: shoppingArticle.selection,
      category: {
        id: shoppingArticle.category_id,
        name: (await Categories.findByPk(shoppingArticle.category_id)).name,
      },
    });
  }

  res.json(transformedShoppingArticles);
});

router.get("/:id", async (req, res) => {
  const shoppingArticle = await ShoppingArticles.findByPk(req.params.id);
  if (!shoppingArticle) {
    res.status(404).send("Shopping article not found");
  } else {
    const transformedArticle = {
      id: shoppingArticle.id,
      name: shoppingArticle.name,
      selection: shoppingArticle.selection,
      category: {
        id: shoppingArticle.category_id,
        name: (await Categories.findByPk(shoppingArticle.category_id)).name,
      },
      createdAt: shoppingArticle.createdAt,
      updatedAt: shoppingArticle.updatedAt,
    };
    res.json(transformedArticle);
  }
});

router.post("/", async (req, res) => {
  const { name, category } = req.body;
  if (!name || !category?.id) {
    return res.status(400).send("Name and category ID are required");
  }
  if ((await Categories.findByPk(category.id)) === null) {
    return res.status(404).send("Category not found");
  }
  if (
    (await ShoppingArticles.findOne({
      where: { name, category_id: category.id },
    })) !== null
  ) {
    return res.status(409).send("Shopping article already exists");
  }
  const shoppingArticle = await ShoppingArticles.create({
    name: name,
    category_id: category.id,
  });
  res.status(201).json(shoppingArticle);
});

router.put("/:id", async (req, res) => {
  const shoppingArticle = await ShoppingArticles.findByPk(req.params.id);
  const { name, category } = req.body;
  if (!name || !category?.id) {
    return res.status(400).send("Name and category ID are required");
  }
  if ((await Categories.findByPk(category.id)) === null) {
    return res.status(404).send("Category not found");
  }
  if (
    (await ShoppingArticles.findOne({
      where: { name, category_id: category.id },
    })) !== null
  ) {
    return res
      .status(409)
      .send("Shopping article with this name and category already exists");
  }
  if (!shoppingArticle) {
    const shoppingArticle = await ShoppingArticles.create({
      name: name,
      category_id: category.id,
    });
    res.status(201).json(shoppingArticle);
  } else {
    if (name) {
      shoppingArticle.name = name;
    }
    if (category) {
      shoppingArticle.category_id = category.id;
    }
    await shoppingArticle.save();
    res.status(204).send();
  }
});

router.delete("/:id", async (req, res) => {
  const shoppingArticle = await ShoppingArticles.findByPk(req.params.id);
  if (!shoppingArticle) {
    return res.status(404).send("Shopping article not found");
  }
  await shoppingArticle.destroy();
  res.status(204).send();
});

module.exports = router;
