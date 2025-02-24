const express = require("express");
const router = express.Router();
const { seedDatabase } = require("../utils/seedDb");

router.post("/", async (req, res, next) => {
  try {
    await seedDatabase();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
