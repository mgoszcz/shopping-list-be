const axios = require("axios");
const {
  currentShopEndpoint,
  resetDatabaseEndpoint,
} = require("../consts/urls");

beforeEach(async () => {
  const shop = await axios.get(currentShopEndpoint);
  console.log("Current shop:", shop.data);
  const response = await axios.post(resetDatabaseEndpoint);
  if (response.status !== 204) {
    throw new Error("Failed to reset database");
  }
}, 30000);
