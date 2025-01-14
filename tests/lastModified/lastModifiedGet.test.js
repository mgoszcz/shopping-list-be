const axios = require("axios");
const {
  lastModifiedTimestampEndpoint,
  lastModifiedCategoriesEndpoint,
  lastModifiedShopsEndpoint,
  lastModifiedShopCategoriesEndpoint,
  lastModifiedShoppingArticlesEndpoint,
  lastModifiedCurrentShopEndpoint,
  lastModifiedShoppingCartEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Last modified endpoint GET", () => {
  test("GET /lastModified should return last modified date of all tables", async () => {
    const response = await axios.get(lastModifiedTimestampEndpoint);
    expect(response.status).toBe(200);
    expect(response.data.categories).toBeDefined();
    expect(response.data.shops).toBeDefined();
    expect(response.data.shop_categories).toBeDefined();
    expect(response.data.shopping_articles).toBeDefined();
    expect(response.data.current_shop).toBeDefined();
  });

  test("GET /lastModified/Category should return last modified date of Categories table", async () => {
    const response = await axios.get(lastModifiedCategoriesEndpoint);
    expect(response.status).toBe(200);
    expect(response.data.lastModified).toBeDefined();
    expect(response.data.tableName).toBe("categories");
    expect(response.data.createdAt).toBeDefined();
    expect(response.data.updatedAt).toBeDefined();
  });

  test("GET /lastModified/Shops should return last modified date of Shops table", async () => {
    const response = await axios.get(lastModifiedShopsEndpoint);
    expect(response.status).toBe(200);
    expect(response.data.lastModified).toBeDefined();
    expect(response.data.tableName).toBe("shops");
    expect(response.data.createdAt).toBeDefined();
    expect(response.data.updatedAt).toBeDefined();
  });

  test("GET /lastModified/ShopCategories should return last modified date of ShopCategories table", async () => {
    const response = await axios.get(lastModifiedShopCategoriesEndpoint);
    expect(response.status).toBe(200);
    expect(response.data.lastModified).toBeDefined();
    expect(response.data.tableName).toBe("shop_categories");
    expect(response.data.createdAt).toBeDefined();
    expect(response.data.updatedAt).toBeDefined();
  });

  test("GET /lastModified/ShoppingArticles should return last modified date of ShoppingArticles table", async () => {
    const response = await axios.get(lastModifiedShoppingArticlesEndpoint);
    expect(response.status).toBe(200);
    expect(response.data.lastModified).toBeDefined();
    expect(response.data.tableName).toBe("shopping_articles");
    expect(response.data.createdAt).toBeDefined();
    expect(response.data.updatedAt).toBeDefined();
  });

  test("GET /lastModified/CurrentShop should return last modified date of CurrentShop table", async () => {
    const response = await axios.get(lastModifiedCurrentShopEndpoint);
    expect(response.status).toBe(200);
    expect(response.data.lastModified).toBeDefined();
    expect(response.data.tableName).toBe("current_shop");
    expect(response.data.createdAt).toBeDefined();
    expect(response.data.updatedAt).toBeDefined();
  });

  test("GET /lastModified/ShoppingCart should return 404 if table not found", async () => {
    try {
      await axios.get(lastModifiedShoppingCartEndpoint);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual(
        "This table name was not found",
      );
    }
  });
});
