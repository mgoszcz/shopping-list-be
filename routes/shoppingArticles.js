const express = require("express");
const router = express.Router();
const {
  ShoppingArticles,
  Categories,
  ShoppingCart,
  ShopCategories,
} = require("../db/db");
const { Op } = require("sequelize");
const updateLastModified = require("../utils/lastModified");

const deleteCategoryIfUnused = async (categoryId) => {
  if (
    (await ShoppingArticles.findOne({ where: { category_id: categoryId } })) ===
    null
  ) {
    await ShopCategories.findAll({ where: { category_id: categoryId } }).then(
      (shopCategories) => {
        for (const shopCategory of shopCategories) {
          shopCategory.destroy();
        }
        updateLastModified("shop_categories");
      },
    );
    const category = await Categories.findByPk(categoryId);
    await category.destroy();
    await updateLastModified("categories");
  }
};

const deleteFromShoppingCartIfNeeded = async (shoppingArticleId) => {
  if (
    (await ShoppingCart.findOne({
      where: { article_id: shoppingArticleId },
    })) === null
  ) {
    return;
  }
  await ShoppingCart.destroy({
    where: { article_id: shoppingArticleId },
  });
  await updateLastModified("shopping_cart");
};

router.get("/", async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const shoppingArticle = await ShoppingArticles.findByPk(req.params.id);
    if (!shoppingArticle) {
      res.status(404).send({ message: "Shopping article not found" });
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
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, category } = req.body;
    if (!name || !category?.id) {
      return res
        .status(400)
        .send({ message: "Name and category ID are required" });
    }
    if ((await Categories.findByPk(category.id)) === null) {
      return res.status(404).send({ message: "Category not found" });
    }
    if (
      (await ShoppingArticles.findOne({
        where: { name, category_id: category.id },
      })) !== null
    ) {
      return res
        .status(409)
        .send({ message: "Shopping article already exists" });
    }
    const shoppingArticle = await ShoppingArticles.create({
      name: name,
      category_id: category.id,
    });
    res.status(201).json(shoppingArticle);
    await updateLastModified("shopping_articles");
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const shoppingArticle = await ShoppingArticles.findByPk(req.params.id);
    const oldCategoryId = shoppingArticle?.category_id;
    const { name, category } = req.body;
    if (!name || !category?.id) {
      return res
        .status(400)
        .send({ message: "Name and category ID are required" });
    }
    if ((await Categories.findByPk(category.id)) === null) {
      return res.status(404).send({ message: "Category not found" });
    }
    if (!shoppingArticle) {
      if (
        (await ShoppingArticles.findOne({
          where: {
            name,
            category_id: category.id,
          },
        })) !== null
      ) {
        return res.status(409).send({
          message:
            "Shopping article with this name and category already exists",
        });
      }
      const shoppingArticle = await ShoppingArticles.create({
        name: name,
        category_id: category.id,
      });
      res.status(201).json(shoppingArticle);
    } else {
      if (
        (await ShoppingArticles.findOne({
          where: {
            name,
            category_id: category.id,
            id: { [Op.ne]: shoppingArticle.id },
          },
        })) !== null
      ) {
        return res.status(409).send({
          message:
            "Shopping article with this name and category already exists",
        });
      }
      if (name) {
        shoppingArticle.name = name;
      }
      if (category) {
        shoppingArticle.category_id = category.id;
      }
      await shoppingArticle.save();
      await deleteCategoryIfUnused(oldCategoryId);
      res.status(204).send();
    }
    await updateLastModified("shopping_articles");
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const shoppingArticle = await ShoppingArticles.findByPk(req.params.id);
    if (!shoppingArticle) {
      return res.status(404).send({ message: "Shopping article not found" });
    }
    if (
      (await ShoppingCart.findOne({
        where: { article_id: shoppingArticle.id },
      })) !== null
    ) {
      return res.status(409).send({ message: "Article in shopping cart" });
    }
    const categoryId = shoppingArticle.category_id;
    await shoppingArticle.destroy();
    await deleteCategoryIfUnused(categoryId);
    await deleteFromShoppingCartIfNeeded(req.params.id);
    res.status(204).send();
    await updateLastModified("shopping_articles");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
