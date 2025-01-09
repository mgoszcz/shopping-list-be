const axios = require("axios");
const { lastModifiedTimestampEndpoint } = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Last modified endpoint GET", () => {
  test("GET /lastModified should return last modified date of all tables", async () => {
    const response = await axios.get(lastModifiedTimestampEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      Categories: "2025-01-07T13:19:51.844Z",
      Shops: "2025-01-07T13:19:51.851Z",
      ShopCategories: "2025-01-07T13:19:51.859Z",
      ShoppingArticles: "2025-01-07T13:19:51.866Z",
      CurrentShop: "2025-01-07T13:19:51.872Z",
    });
  });

  test("GET /lastModified/Category should return last modified date of Categories table", async () => {
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/Categories`,
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      lastModified: "2025-01-07T13:19:51.844Z",
      tableName: "Categories",
      createdAt: "2025-01-07T13:19:51.844Z",
      updatedAt: "2025-01-07T13:19:51.844Z",
    });
  });

  test("GET /lastModified/Shops should return last modified date of Shops table", async () => {
    const response = await axios.get(`${lastModifiedTimestampEndpoint}/Shops`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      lastModified: "2025-01-07T13:19:51.851Z",
      tableName: "Shops",
      createdAt: "2025-01-07T13:19:51.851Z",
      updatedAt: "2025-01-07T13:19:51.851Z",
    });
  });

  test("GET /lastModified/ShopCategories should return last modified date of ShopCategories table", async () => {
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/ShopCategories`,
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      lastModified: "2025-01-07T13:19:51.859Z",
      tableName: "ShopCategories",
      createdAt: "2025-01-07T13:19:51.859Z",
      updatedAt: "2025-01-07T13:19:51.859Z",
    });
  });

  test("GET /lastModified/ShoppingArticles should return last modified date of ShoppingArticles table", async () => {
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/ShoppingArticles`,
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      lastModified: "2025-01-07T13:19:51.866Z",
      tableName: "ShoppingArticles",
      createdAt: "2025-01-07T13:19:51.866Z",
      updatedAt: "2025-01-07T13:19:51.866Z",
    });
  });

  test("GET /lastModified/CurrentShop should return last modified date of CurrentShop table", async () => {
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/CurrentShop`,
    );
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      lastModified: "2025-01-07T13:19:51.872Z",
      tableName: "CurrentShop",
      createdAt: "2025-01-07T13:19:51.872Z",
      updatedAt: "2025-01-07T13:19:51.872Z",
    });
  });

  test("GET /lastModified/CurrentShop should return 404 if table not found", async () => {
    try {
      await axios.get(`${lastModifiedTimestampEndpoint}/ShoppingCart`);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual(
        "This table name was not found",
      );
    }
  });
});
