const axios = require("axios");
const { currentShopEndpoint, shopsEndpoint } = require("./consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Current shop endpoint", () => {
  test("GET /currentShop should return current shop", async () => {
    const response = await axios.get(currentShopEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      shop_id: 1,
      name: "Shop 1",
      logo: "logo1.jpg",
    });
  });

  test("GET /currentShop should return null if no current shop", async () => {
    await axios.delete(`${shopsEndpoint}/1`);
    const response = await axios.get(currentShopEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      shop_id: null,
      name: null,
      logo: null,
    });
  });

  test("PUT /currentShop should update current shop", async () => {
    const response = await axios.put(currentShopEndpoint, { shop_id: 2 });
    expect(response.status).toBe(204);
    const currentShopResponse = await axios.get(currentShopEndpoint);
    expect(currentShopResponse.data).toEqual({
      shop_id: 2,
      name: "Shop 2",
      logo: "logo2.jpg",
    });
  });

  test("PUT /currentShop should return 400 if shop_id is not provided", async () => {
    try {
      await axios.put(currentShopEndpoint);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual("Shop ID is required");
    }
  });

  test("PUT /currentShop should return 404 if shop not found", async () => {
    try {
      await axios.put(currentShopEndpoint, { shop_id: 100 });
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shop not found");
    }
  });
});
