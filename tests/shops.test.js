const axios = require("axios");
const {
  shopsEndpoint,
  shopCategoriesEndpoint,
  currentShopEndpoint,
} = require("./consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Shops endpoint", () => {
  test("GET /shops should return an array of shops", async () => {
    const response = await axios.get(shopsEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      { id: 1, name: "Shop 1", logo: "logo1.jpg" },
      { id: 2, name: "Shop 2", logo: "logo2.jpg" },
      { id: 3, name: "Shop 3", logo: "logo2.jpg" },
    ]);
  });

  test("GET /shops/id should return specific shop", async () => {
    const response = await axios.get(`${shopsEndpoint}/1`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: 1,
      name: "Shop 1",
      logo: "logo1.jpg",
      createdAt: "2025-01-07T13:19:51.846Z",
      updatedAt: "2025-01-07T13:19:51.846Z",
    });
  });

  test("GET /shops/id should return 404 if shop not found", async () => {
    try {
      await axios.get(`${shopsEndpoint}/100`);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shop not found");
    }
  });

  test("POST /shops user can add new shop", async () => {
    const response = await axios.post(shopsEndpoint, {
      name: "New Shop",
      logo: "newlogo.jpg",
    });
    expect(response.status).toBe(201);
    expect(response.data.name).toBe("New Shop");
    expect(response.data.id).toBeDefined();
  });

  test("POST /shops returns 400 for wrong request", async () => {
    try {
      await axios.post(shopsEndpoint);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual("Name and logo is required");
    }
  });

  test("POST /shops returns 409 for existing shop", async () => {
    try {
      await axios.post(shopsEndpoint, {
        name: "Shop 1",
        logo: "logo1.jpg",
      });
      throw new Error("Expected request to fail with 409, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(409);
      expect(error.response.data.message).toEqual("Shop already exists");
    }
  });

  test("PUT /shops/id should update shop", async () => {
    const response = await axios.put(`${shopsEndpoint}/1`, {
      name: "Updated Shop",
      logo: "updatedlogo.jpg",
    });
    expect(response.status).toBe(204);
    const updatedShop = await axios.get(`${shopsEndpoint}/1`);
    expect(updatedShop.data.name).toBe("Updated Shop");
    expect(updatedShop.data.logo).toBe("updatedlogo.jpg");
  });

  test("PUT /shops/id should create shop if not found", async () => {
    const response = await axios.put(`${shopsEndpoint}/100`, {
      name: "New Shop",
      logo: "newlogo.jpg",
    });
    expect(response.status).toBe(201);
    expect(response.data.name).toBe("New Shop");
    expect(response.data.id).toBeDefined();
  });

  test("PUT /shops/id should return 400 for wrong request", async () => {
    try {
      await axios.put(`${shopsEndpoint}/1`);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual("Name and logo is required");
    }
  });

  test("PUT /shops/id should return 409 for existing shop", async () => {
    try {
      await axios.put(`${shopsEndpoint}/1`, {
        name: "Shop 2",
        logo: "logo2.jpg",
      });
      throw new Error("Expected request to fail with 409, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(409);
      expect(error.response.data.message).toEqual("Shop already exists");
    }
  });

  test("DELETE /shops/id should delete shop", async () => {
    const response = await axios.delete(`${shopsEndpoint}/1`);
    expect(response.status).toBe(204);
    try {
      await axios.get(`${shopsEndpoint}/1`);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shop not found");
    }
  });

  test("DELETE /shops/id should return 404 if shop not found", async () => {
    try {
      await axios.delete(`${shopsEndpoint}/100`);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shop not found");
    }
  });

  test("DELETE /shops/id should remove categories for this shop", async () => {
    await axios.delete(`${shopsEndpoint}/1`);
    try {
      await axios.get(shopCategoriesEndpoint(1));
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shop not found");
    }
  });

  test("DELETE /shops/id should clean current shop if needed", async () => {
    await axios.delete(`${shopsEndpoint}/1`);
    const currentShop = await axios.get(currentShopEndpoint);
    expect(currentShop.data.shop_id).toBeNull();
  });
});
