const express = require("express");
const router = express.Router();
const { clearDb } = require("../utils/seedDb");
require("dotenv").config();

const CLEAR_PASSWORD = process.env.CLEAR_DB_PSWD;

router.post("/", async (req, res, next) => {
  try {
    const passProvided = req.header("CLEAR_PASSWORD");
    if (passProvided !== CLEAR_PASSWORD) {
      res.status(401).send();
      return;
    }
    await clearDb();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
