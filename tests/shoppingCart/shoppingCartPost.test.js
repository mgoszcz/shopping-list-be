const axios = require("axios");
const {
  shoppingCartEndpoint,
  shoppingArticlesEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Shopping cart endpoint POST", () => {
  test("POST /shoppingCart should add a product to the shopping cart", async () => {
    const response = await axios.post(shoppingCartEndpoint, {
      article: { id: 2 },
    });
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
    expect(response.data.article.id).toBe(2);
    expect(response.data.category.id).toBe(2);
    expect(response.data.quantity).toBe(1);
    expect(response.data.checked).toBe(false);
    const getResponse = await axios.get(shoppingCartEndpoint);
    expect(getResponse.data.map((item) => item.article.id)).toContain(2);
  });

  test("POST /shoppingCart should increment selection in shoppingArticle", async () => {
    await axios.post(shoppingCartEndpoint, {
      article: { id: 2 },
    });
    const response = await axios.get(`${shoppingArticlesEndpoint}/2`);
    expect(response.data.selection).toBe(2);
  });

  test("POST /shoppingCart should return 400 for wrong request", async () => {
    try {
      await axios.post(shoppingCartEndpoint);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual("Article ID is required");
    }
  });

  test("POST /shoppingCart should return 404 for non-existing article", async () => {
    try {
      await axios.post(shoppingCartEndpoint, {
        article: { id: 100 },
      });
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Article not found");
    }
  });

  test("POST /shoppingCart should return 409 for already existing article", async () => {
    try {
      await axios.post(shoppingCartEndpoint, {
        article: { id: 1 },
      });
      throw new Error("Expected request to fail with 409, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(409);
      expect(error.response.data.message).toEqual(
        "Article already in shopping cart",
      );
    }
  });
});
