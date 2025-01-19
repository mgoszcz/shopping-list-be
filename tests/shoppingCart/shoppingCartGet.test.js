const axios = require("axios");
const {
  shoppingCartEndpoint,
  currentShopEndpoint,
  shopsEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");
const {
  CART_SORTED_BY_SHOP,
  CART_SORTED_ALPHABETICALLY,
  CART_WITH_SOME_NOT_SORTED,
  CART_ONLY_CHECKED,
  CART_ONLY_UNCHECKED,
} = require("./shoppingCartAssets");

describe("Shopping cart endpoint GET", () => {
  test("GET /shoppingCart should return an array of products no param - sorted by shop", async () => {
    const response = await axios.get(shoppingCartEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(CART_SORTED_BY_SHOP);
  });

  test("GET /shoppingCart should return an array of products param sort by shop", async () => {
    const response = await axios.get(shoppingCartEndpoint, {
      params: {
        sort: "byShop",
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual(CART_SORTED_BY_SHOP);
  });

  test("GET /shoppingCart should return an array of products param sort alphabetically", async () => {
    const response = await axios.get(shoppingCartEndpoint, {
      params: {
        sort: "alpha",
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual(CART_SORTED_ALPHABETICALLY);
  });

  test("GET /shoppingCart should return an array of products some categories not in shop categories", async () => {
    await axios.put(currentShopEndpoint, { shop_id: 2 });
    const response = await axios.get(shoppingCartEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(CART_WITH_SOME_NOT_SORTED);
  });

  test("GET /shoppingCart should return an array of products no categories in shop categories", async () => {
    await axios.put(currentShopEndpoint, { shop_id: 3 });
    const response = await axios.get(shoppingCartEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(CART_SORTED_ALPHABETICALLY);
  });

  test("GET /shoppingCart should return an array of products without current shop", async () => {
    await axios.delete(`${shopsEndpoint}/1`);
    const response = await axios.get(shoppingCartEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(CART_SORTED_ALPHABETICALLY);
  });

  test("GET /shoppingCart can return only checked items with query param", async () => {
    const response = await axios.get(shoppingCartEndpoint, {
      params: {
        checked: true,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual(CART_ONLY_CHECKED);
  });

  test("GET /shoppingCart can return only unchecked items with query param", async () => {
    const response = await axios.get(shoppingCartEndpoint, {
      params: {
        unchecked: true,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual(CART_ONLY_UNCHECKED);
  });

  test("GET /shoppingCart should return 400 if wrong sort param provided", async () => {
    try {
      await axios.get(shoppingCartEndpoint, {
        params: {
          sort: "wrong",
        },
      });
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual("Invalid sorting order");
    }
  });

  test("GET /shoppingCart/id should return specific product", async () => {
    const response = await axios.get(`${shoppingCartEndpoint}/1`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
    expect(response.data.article).toEqual({
      id: 3,
      name: "ZZ third article",
    });
    expect(response.data.category).toEqual({
      id: 1,
      name: "beta",
    });
    expect(response.data.quantity).toBe(2);
    expect(response.data.checked).toBe(true);
    expect(response.data.createdAt).toBeDefined();
    expect(response.data.updatedAt).toBeDefined();
  });

  test("GET /shoppingCart/id should return 404 if product not found", async () => {
    try {
      await axios.get(`${shoppingCartEndpoint}/100`);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual(
        "Shopping cart item not found",
      );
    }
  });
});
