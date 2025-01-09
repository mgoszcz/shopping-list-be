const axios = require("axios");
const { categoriesEndpoint } = require("./consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Categories endpoint", () => {
  test("GET /categories should return an array of categories", async () => {
    const response = await axios.get(categoriesEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      { id: 1, name: "beta" },
      { id: 2, name: "gamma" },
      { id: 3, name: "alpha" },
    ]);
  });

  test("GET /categories/id should return specific category", async () => {
    const response = await axios.get(`${categoriesEndpoint}/1`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: 1,
      name: "beta",
      createdAt: "2025-01-07T13:19:51.838Z",
      updatedAt: "2025-01-07T13:19:51.838Z",
    });
  });

  test("GET /categories/id should return 404 if category not found", async () => {
    try {
      const response = await axios.get(`${categoriesEndpoint}/100`);
      // If the request doesn't throw, the test should fail
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Category not found");
    }
  });

  test("POST /categories user can add new category", async () => {
    const response = await axios.post(categoriesEndpoint, {
      name: "New Category",
    });
    expect(response.status).toBe(201);
    expect(response.data.name).toBe("New Category");
    expect(response.data.id).toBeDefined();
  });

  test("POST /categories returns 400 for wrong request", async () => {
    try {
      const response = await axios.post(categoriesEndpoint);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual("Name is required");
    }
  });

  test("POST /categories returns 409 if article already exists", async () => {
    try {
      const response = await axios.post(categoriesEndpoint, { name: "alpha" });
      throw new Error("Expected request to fail with 409, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(409);
      expect(error.response.data.message).toEqual("Category already exists");
    }
  });
});
