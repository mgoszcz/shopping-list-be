const express = require("express");
const router = express.Router();
const { LastModified } = require("../db/db");

router.get("/", async (req, res, next) => {
  try {
    const lastModified = await LastModified.findAll();
    const transformedLastModified = {};
    for (const item of lastModified) {
      transformedLastModified[item.table_name] = item.last_modified;
    }
    res.json(transformedLastModified);
  } catch (err) {
    next(err);
  }
});

router.get("/:table_name", async (req, res, next) => {
  try {
    const lastModified = await LastModified.findOne({
      where: { table_name: req.params.table_name },
    });
    if (!lastModified) {
      return res.status(404).send({ message: "This table name was not found" });
    }
    const transformedLastModified = {
      tableName: lastModified.table_name,
      lastModified: lastModified.last_modified,
      createdAt: lastModified.createdAt,
      updatedAt: lastModified.updatedAt,
    };
    res.json(transformedLastModified);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
