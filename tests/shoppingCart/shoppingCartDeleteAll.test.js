const axios = require("axios");
const {
  shoppingCartEndpoint,
  shoppingArticlesEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");
const {
  CART_ONLY_CHECKED,
  CART_ONLY_UNCHECKED,
} = require("./shoppingCartAssets");

describe("Shopping cart endpoint DELETE ALL", () => {
  test("DELETE /shoppingCart should delete all products from the shopping cart", async () => {
    const response = await axios.delete(shoppingCartEndpoint);
    expect(response.status).toBe(204);
    const getResponse = await axios.get(shoppingCartEndpoint);
    expect(getResponse.data).toEqual([]);
  });

  test("DELETE /shoppingCart should reset id back to 1", async () => {
    await axios.delete(shoppingCartEndpoint);
    const response = await axios.post(shoppingCartEndpoint, {
      article: { id: 2 },
    });
    expect(response.data.id).toBe(1);
  });

  test("DELETE /shoppingCart should delete only checked items if parameter provided", async () => {
    await axios.delete(shoppingCartEndpoint, {
      params: {
        checked: true,
      },
    });
    const response = await axios.get(shoppingCartEndpoint);
    expect(response.data).toEqual(CART_ONLY_UNCHECKED);
  });

  test("DELETE /shoppingCart should delete only unchecked items if parameter provided", async () => {
    await axios.delete(shoppingCartEndpoint, {
      params: {
        unchecked: true,
      },
    });
    const response = await axios.get(shoppingCartEndpoint);
    expect(response.data).toEqual(CART_ONLY_CHECKED);
  });

  test("DELETE /shoppingCart after removing checked and then unchecked should return empty array and reset id to 1", async () => {
    await axios.delete(shoppingCartEndpoint, {
      params: {
        unchecked: true,
      },
    });
    await axios.delete(shoppingCartEndpoint, {
      params: {
        checked: true,
      },
    });
    const response = await axios.get(shoppingCartEndpoint);
    expect(response.data).toEqual([]);
    const postResponse = await axios.post(shoppingCartEndpoint, {
      article: { id: 2 },
    });
    expect(postResponse.data.id).toBe(1);
  });

  test("DELETE /shoppingCart delete all should decrease selection for unchecked items in shoppingArticle", async () => {
    await axios.delete(shoppingCartEndpoint);
    let response = await axios.get(`${shoppingArticlesEndpoint}/3`);
    expect(response.data.selection).toBe(1);
    response = await axios.get(`${shoppingArticlesEndpoint}/4`);
    expect(response.data.selection).toBe(0);
    response = await axios.get(`${shoppingArticlesEndpoint}/1`);
    expect(response.data.selection).toBe(0);
  });

  test("DELETE /shoppingCart delete unchecked should decrease selection for unchecked items in shoppingArticle", async () => {
    await axios.delete(shoppingCartEndpoint, {
      params: {
        unchecked: true,
      },
    });
    response = await axios.get(`${shoppingArticlesEndpoint}/4`);
    expect(response.data.selection).toBe(0);
    response = await axios.get(`${shoppingArticlesEndpoint}/1`);
    expect(response.data.selection).toBe(0);
  });

  test("DELETE /shoppingCart delete checked should not decrease selection in shoppingArticle", async () => {
    await axios.delete(shoppingCartEndpoint, {
      params: {
        checked: true,
      },
    });
    let response = await axios.get(`${shoppingArticlesEndpoint}/3`);
    expect(response.data.selection).toBe(1);
    response = await axios.get(`${shoppingArticlesEndpoint}/4`);
    expect(response.data.selection).toBe(1);
    response = await axios.get(`${shoppingArticlesEndpoint}/1`);
    expect(response.data.selection).toBe(1);
  });

  test("DELETE /shoppingCart should return 400 when using both params", async () => {
    try {
      await axios.delete(shoppingCartEndpoint, {
        params: {
          checked: true,
          unchecked: true,
        },
      });
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual(
        "Cannot use both checked and unchecked parameters",
      );
    }
  });
});
