const axios = require("axios");
const {
  shopsEndpoint,
  lastModifiedShopCategoriesEndpoint,
  shopCategoriesEndpoint,
  shoppingCartEndpoint,
  shoppingArticlesEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Last modified endpoint for ShopCategories", () => {
  test("PUT updating shop category should update last modified date of ShopCategories table", async () => {
    const timestampBefore = (
      await axios.get(lastModifiedShopCategoriesEndpoint)
    ).data.lastModified;
    await axios.put(shopCategoriesEndpoint(1), [
      {
        category: {
          id: 1,
        },
        category_order: 1,
      },
      {
        category: {
          id: 2,
        },
        category_order: 2,
      },
    ]);
    const response = await axios.get(lastModifiedShopCategoriesEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("PUT removing categories for shop should update last modified date of ShopCategories table", async () => {
    const timestampBefore = (
      await axios.get(lastModifiedShopCategoriesEndpoint)
    ).data.lastModified;
    await axios.put(shopCategoriesEndpoint(1), []);
    const response = await axios.get(lastModifiedShopCategoriesEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("removing shop that is in shop categories should update last modified date of ShopCategories table", async () => {
    const timestampBefore = (
      await axios.get(lastModifiedShopCategoriesEndpoint)
    ).data.lastModified;
    await axios.delete(`${shopsEndpoint}/1`);
    const response = await axios.get(lastModifiedShopCategoriesEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("removing category that is in shop categories should update last modified date of ShopCategories table", async () => {
    const timestampBefore = (
      await axios.get(lastModifiedShopCategoriesEndpoint)
    ).data.lastModified;
    await axios.delete(`${shoppingCartEndpoint}/1`);
    await axios.delete(`${shoppingArticlesEndpoint}/3`);
    const response = await axios.get(lastModifiedShopCategoriesEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });
});
