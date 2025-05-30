const axios = require("axios");
const {
  shopsEndpoint,
  currentShopEndpoint,
  lastModifiedCurrentShopEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Last modified endpoint for currentShop", () => {
  test("PUT updating current shop should update last modified date of currentShop table", async () => {
    const timestampBefore = (await axios.get(lastModifiedCurrentShopEndpoint))
      .data.lastModified;
    await axios.put(currentShopEndpoint, {
      shop_id: 2,
    });
    const response = await axios.get(lastModifiedCurrentShopEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("clearing current shop after shop removal should update last modified date of currentShop table", async () => {
    let r = await axios.get(currentShopEndpoint);
    const timestampBefore = (await axios.get(lastModifiedCurrentShopEndpoint))
      .data.lastModified;
    await axios.delete(`${shopsEndpoint}/1`);
    r = await axios.get(currentShopEndpoint);
    const response = await axios.get(lastModifiedCurrentShopEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });
});
