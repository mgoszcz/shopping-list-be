const axios = require("axios");
const {
  shopCategoriesEndpoint,
  shoppingArticlesEndpoint,
  shoppingCartEndpoint,
} = require("./consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Shop categories endpoint", () => {
  test("GET /shops/:shopId/categories should return an array of categories for a shop", async () => {
    const response = await axios.get(shopCategoriesEndpoint(1));
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      {
        category: {
          id: 2,
          name: "gamma",
        },
        category_order: 1,
      },
      {
        category: {
          id: 1,
          name: "beta",
        },
        category_order: 2,
      },
      {
        category: {
          id: 3,
          name: "alpha",
        },
        category_order: 3,
      },
    ]);
  });

  test("GET /shops/:shopId/categories should return an empty array if shop has no categories", async () => {
    const response = await axios.get(shopCategoriesEndpoint(3));
    expect(response.status).toBe(200);
    expect(response.data).toEqual([]);
  });

  test("GET /shops/:shopId/categories should return 404 if shop not found", async () => {
    try {
      await axios.get(shopCategoriesEndpoint(100));
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shop not found");
    }
  });

  test("PUT /shops/:shopId/categories should update categories for a shop without categories", async () => {
    const response = await axios.put(shopCategoriesEndpoint(3), [
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
      {
        category: {
          id: 3,
        },
        category_order: 3,
      },
    ]);
    expect(response.status).toBe(204);
    const getResponse = await axios.get(shopCategoriesEndpoint(3));
    expect(getResponse.data).toEqual([
      {
        category: {
          id: 1,
          name: "beta",
        },
        category_order: 1,
      },
      {
        category: {
          id: 2,
          name: "gamma",
        },
        category_order: 2,
      },
      {
        category: {
          id: 3,
          name: "alpha",
        },
        category_order: 3,
      },
    ]);
  });

  test("PUT /shops/:shopId/categories should update categories for a shop with categories", async () => {
    const response = await axios.put(shopCategoriesEndpoint(1), [
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
    expect(response.status).toBe(204);
    const getResponse = await axios.get(shopCategoriesEndpoint(1));
    expect(getResponse.data).toEqual([
      {
        category: {
          id: 1,
          name: "beta",
        },
        category_order: 1,
      },
      {
        category: {
          id: 2,
          name: "gamma",
        },
        category_order: 2,
      },
    ]);
  });

  test("PUT /shops/:shopId/categories should delete all categories for a shop", async () => {
    const response = await axios.put(shopCategoriesEndpoint(1), []);
    expect(response.status).toBe(204);
    const getResponse = await axios.get(shopCategoriesEndpoint(1));
    expect(getResponse.data).toEqual([]);
  });

  test("PUT /shops/:shopId/categories should return 404 if shop not found", async () => {
    try {
      await axios.put(shopCategoriesEndpoint(100), []);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shop not found");
    }
  });

  test("PUT /shops/:shopId/categories should return 400 if category ID is missing", async () => {
    try {
      await axios.put(shopCategoriesEndpoint(1), [
        {
          category_order: 1,
        },
      ]);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual("Category ID is required");
    }
  });

  test("PUT /shops/:shopId/categories should return 400 if category order is missing", async () => {
    try {
      await axios.put(shopCategoriesEndpoint(1), [
        {
          category: {
            id: 1,
          },
        },
      ]);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual("Category order is required");
    }
  });

  test("PUT /shops/:shopId/categories should return 404 if category not found", async () => {
    try {
      await axios.put(shopCategoriesEndpoint(1), [
        {
          category: {
            id: 100,
          },
          category_order: 1,
        },
      ]);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual(
        "Category with ID 100 not found",
      );
    }
  });

  test("PUT /shops/:shopId/categories should return 400 if categories are not unique", async () => {
    try {
      await axios.put(shopCategoriesEndpoint(1), [
        {
          category: {
            id: 1,
          },
          category_order: 1,
        },
        {
          category: {
            id: 1,
          },
          category_order: 2,
        },
      ]);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual(
        "Category with ID 1 is duplicated",
      );
    }
  });

  test("category should be removed if is deleted", async () => {
    await axios.delete(`${shoppingCartEndpoint}/1`);
    await axios.delete(`${shoppingArticlesEndpoint}/3`);
    const response = await axios.get(shopCategoriesEndpoint(1));
    expect(response.data).toEqual([
      {
        category: {
          id: 2,
          name: "gamma",
        },
        category_order: 1,
      },
      {
        category: {
          id: 3,
          name: "alpha",
        },
        category_order: 3,
      },
    ]);
  });
});
