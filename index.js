const express = require("express");
const bodyParser = require("body-parser");
const categories = require("./routes/categories");
const shoppingArticles = require("./routes/shoppingArticles");
const shoppingCart = require("./routes/shoppingCart");
const shops = require("./routes/shops");
const shopCategories = require("./routes/shopCategories");
const currentShop = require("./routes/currentShop");
const lastModifiedTimestamp = require("./routes/lastModifiedTimestamp");
const db = require("./db/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use("/categories", categories);
app.use("/shoppingArticles", shoppingArticles);
app.use("/shoppingCart", shoppingCart);
app.use("/shops", shops);
app.use("/shops/:id/categories", shopCategories);
app.use("/currentShop", currentShop);
app.use("/lastModifiedTimestamp", lastModifiedTimestamp);

app.use(errorHandler);

db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit with an error code
  });
