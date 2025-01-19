const seedDatabase = require("./seedDb");
const axios = require("axios");
const { currentShopEndpoint } = require("../consts/urls");

beforeEach(async () => {
  const shop = await axios.get(currentShopEndpoint);
  console.log("Current shop:", shop.data);
  await seedDatabase();
}, 30000);
