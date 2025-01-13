const axios = require("axios");
const {
  shoppingCartEndpoint,
  shoppingArticlesEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Shopping cart endpoint DELETE", () => {
  test("DELETE /shoppingCart/id should delete the product from the shopping cart", async () => {
    const response = await axios.delete(`${shoppingCartEndpoint}/1`);
    expect(response.status).toBe(204);
    try {
      await axios.get(`${shoppingCartEndpoint}/1`);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual(
        "Shopping cart item not found",
      );
    }
  });

  test("DELETE /shoppingCart/id deleting unchecked item should decrease selection in shoppingArticle", async () => {
    await axios.delete(`${shoppingCartEndpoint}/2`);
    const response = await axios.get(`${shoppingArticlesEndpoint}/4`);
    expect(response.data.selection).toBe(0);
  });

  test("DELETE /shoppingCart/id deleting checked item should not decrease selection in shoppingArticle", async () => {
    await axios.delete(`${shoppingCartEndpoint}/1`);
    const response = await axios.get(`${shoppingArticlesEndpoint}/3`);
    expect(response.data.selection).toBe(1);
  });

  test("DELETE /shoppingCart/id deleting last item should reset id back to 1", async () => {
    await axios.delete(`${shoppingCartEndpoint}/3`);
    await axios.delete(`${shoppingCartEndpoint}/2`);
    await axios.delete(`${shoppingCartEndpoint}/1`);
    const response = await axios.post(shoppingCartEndpoint, {
      article: { id: 2 },
    });
    expect(response.data.id).toBe(1);
  });

  test("DELETE /shoppingCart/id should return 404 for non-existing shopping cart item", async () => {
    try {
      await axios.delete(`${shoppingCartEndpoint}/100`);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual(
        "Shopping cart item not found",
      );
    }
  });
});
