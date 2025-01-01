const express = require("express");
const bodyParser = require("body-parser");
const categories = require("./routes/categories");
const shoppingArticles = require("./routes/shoppingArticles");
const shoppingCart = require("./routes/shoppingCart");
const shops = require("./routes/shops");
const shopCategories = require("./routes/shopCategories");
const currentShop = require("./routes/currentShop");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use("/categories", categories);
app.use("/shopping_articles", shoppingArticles);
app.use("/shopping_cart", shoppingCart);
app.use("/shops", shops);
app.use("/shops/:id/categories", shopCategories);
app.use("/current_shop", currentShop);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
