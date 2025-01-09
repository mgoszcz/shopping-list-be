const axios = require("axios");
const { shoppingCartEndpoint } = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Shopping cart endpoint PUT", () => {
  test("PUT /shoppingCart/id should update the quantity of the product in the shopping cart", async () => {
    const response = await axios.put(`${shoppingCartEndpoint}/1`, {
      quantity: 3,
    });
    expect(response.status).toBe(204);
    const getResponse = await axios.get(`${shoppingCartEndpoint}/1`);
    expect(getResponse.data.quantity).toBe(3);
  });

  test("PUT /shoppingCart/id should update the checked status of the product in the shopping cart", async () => {
    const response = await axios.put(`${shoppingCartEndpoint}/1`, {
      checked: false,
    });
    expect(response.status).toBe(204);
    const getResponse = await axios.get(`${shoppingCartEndpoint}/1`);
    expect(getResponse.data.checked).toBe(false);
  });

  test("PUT /shoppingCart/id should not modify article id", async () => {
    const response = await axios.put(`${shoppingCartEndpoint}/1`, {
      article: { id: 2 },
    });
    expect(response.status).toBe(204);
    const getResponse = await axios.get(`${shoppingCartEndpoint}/1`);
    expect(getResponse.data.article.id).toBe(3);
  });

  test("PUT /shoppingCart/id should return 404 for non-existing shopping cart item", async () => {
    try {
      await axios.put(`${shoppingCartEndpoint}/100`, {
        quantity: 3,
      });
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual(
        "Shopping cart item not found",
      );
    }
  });
});
