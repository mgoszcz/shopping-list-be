const express = require("express");
const router = express.Router();
const { Categories } = require("../db/db");
const updateLastModified = require("../utils/lastModified");

router.get("/", async (req, res, next) => {
  try {
    const categories = await Categories.findAll();
    const transformedCategories = categories.map((category) => {
      return {
        id: category.id,
        name: category.name,
      };
    });
    res.json(transformedCategories);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const category = await Categories.findByPk(req.params.id);
    if (!category) {
      res.status(404).send({ message: "Category not found" });
    } else {
      res.json(category);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    if ((await Categories.findOne({ where: { name } })) !== null) {
      return res.status(409).send({ message: "Category already exists" });
    }

    const category = await Categories.create(req.body);
    res.status(201).json(category);
    await updateLastModified("categories");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
