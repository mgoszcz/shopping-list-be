const axios = require("axios");
const {
  shoppingArticlesEndpoint,
  categoriesEndpoint,
  shoppingCartEndpoint,
} = require("./consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Shopping Articles endpoint", () => {
  test("GET /shoppingArticles should return list of articles", async () => {
    const response = await axios.get(shoppingArticlesEndpoint);
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      {
        id: 1,
        name: "HH first article",
        selection: 1,
        category: {
          id: 3,
          name: "alpha",
        },
      },
      {
        id: 2,
        name: "AA second article",
        selection: 1,
        category: {
          id: 2,
          name: "gamma",
        },
      },
      {
        id: 3,
        name: "ZZ third article",
        selection: 1,
        category: {
          id: 1,
          name: "beta",
        },
      },
      {
        id: 4,
        name: "XX fourth article",
        selection: 1,
        category: {
          id: 2,
          name: "gamma",
        },
      },
    ]);
  });

  test("GET /shoppingArticles/id should return specific article", async () => {
    const response = await axios.get(`${shoppingArticlesEndpoint}/1`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
    expect(response.data.name).toBe("HH first article");
    expect(response.data.selection).toBe(1);
    expect(response.data.category).toEqual({
      id: 3,
      name: "alpha",
    });
    expect(response.data.createdAt).toBeDefined();
    expect(response.data.updatedAt).toBeDefined();
  });

  test("GET /shoppingArticles/id should 404 if article not found", async () => {
    try {
      await axios.get(`${shoppingArticlesEndpoint}/100`);
      // If the request doesn't throw, the test should fail
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shopping article not found");
    }
  });

  test("POST /shoppingArticles user can add new article", async () => {
    const response = await axios.post(shoppingArticlesEndpoint, {
      name: "New Article",
      category: {
        id: 3,
      },
    });
    expect(response.status).toBe(201);
    expect(response.data.name).toBe("New Article");
    expect(response.data.category.id).toBe(3);
    expect(response.data.id).toBeDefined();
  });

  test("POST /shoppingArticles user can add new article with same name and different category", async () => {
    const response = await axios.post(shoppingArticlesEndpoint, {
      name: "HH first article",
      category: {
        id: 2,
      },
    });
    expect(response.status).toBe(201);
    expect(response.data.name).toBe("HH first article");
    expect(response.data.category.id).toBe(2);
    expect(response.data.id).toBeDefined();
    const allArticles = await axios.get(shoppingArticlesEndpoint);
    expect(
      allArticles.data.filter((article) => article.name === "HH first article")
        .length,
    ).toBe(2);
  });

  test("POST /shoppingArticles should return 400 for invalid request", async () => {
    try {
      await axios.post(shoppingArticlesEndpoint);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual(
        "Name and category ID are required",
      );
    }
  });

  test("POST /shoppingArticles should return 404 if category not found", async () => {
    try {
      await axios.post(shoppingArticlesEndpoint, {
        name: "Bad Category Article",
        category: {
          id: 300,
        },
      });
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Category not found");
    }
  });

  test("POST /shoppingArticles should return 409 if article already exists", async () => {
    try {
      await axios.post(shoppingArticlesEndpoint, {
        name: "HH first article",
        category: {
          id: 3,
        },
      });
      throw new Error("Expected request to fail with 409, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(409);
      expect(error.response.data.message).toEqual(
        "Shopping article already exists",
      );
    }
  });

  test("PUT /shoppingArticles/id user can update article", async () => {
    const response = await axios.put(`${shoppingArticlesEndpoint}/2`, {
      name: "updated Name",
      category: {
        id: 1,
      },
    });
    expect(response.status).toBe(204);
    const updatedArticle = await axios.get(`${shoppingArticlesEndpoint}/2`);
    expect(updatedArticle.data.name).toBe("updated Name");
    expect(updatedArticle.data.category.id).toBe(1);
  });

  test("PUT /shoppingArticles/id should user can update only category", async () => {
    const response = await axios.put(`${shoppingArticlesEndpoint}/2`, {
      name: "AA second article",
      category: {
        id: 3,
      },
    });
    expect(response.status).toBe(204);
    const updatedArticle = await axios.get(`${shoppingArticlesEndpoint}/2`);
    expect(updatedArticle.data.name).toBe("AA second article");
    expect(updatedArticle.data.category.id).toBe(3);
  });

  test("PUT /shoppingArticles/id user can add new article if id does not exist", async () => {
    const response = await axios.put(`${shoppingArticlesEndpoint}/5`, {
      name: "PUT new Name",
      category: {
        id: 1,
      },
    });
    expect(response.status).toBe(201);
    expect(response.data.name).toBe("PUT new Name");
    expect(response.data.category.id).toBe(1);
    expect(response.data.id).toBeDefined();
    const updatedArticle = await axios.get(`${shoppingArticlesEndpoint}/5`);
    expect(updatedArticle.data.name).toBe("PUT new Name");
    expect(updatedArticle.data.category.id).toBe(1);
  });

  test("PUT /shoppingArticles/id should return 400 for invalid request", async () => {
    try {
      await axios.put(`${shoppingArticlesEndpoint}/1`);
      throw new Error("Expected request to fail with 400, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toEqual(
        "Name and category ID are required",
      );
    }
  });

  test("PUT /shoppingArticles/id should return 404 if category not found", async () => {
    try {
      await axios.put(`${shoppingArticlesEndpoint}/1`, {
        name: "Bad Category Article",
        category: {
          id: 300,
        },
      });
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Category not found");
    }
  });

  test("PUT /shoppingArticles/id should return 409 if article already exists", async () => {
    try {
      await axios.put(`${shoppingArticlesEndpoint}/2`, {
        name: "HH first article",
        category: {
          id: 3,
        },
      });
      throw new Error("Expected request to fail with 409, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(409);
      expect(error.response.data.message).toEqual(
        "Shopping article with this name and category already exists",
      );
    }
  });

  test("PUT /shoppingArticles/id unused category should be removed", async () => {
    const response = await axios.put(`${shoppingArticlesEndpoint}/1`, {
      name: "HH first article",
      category: {
        id: 2,
      },
    });
    expect(response.status).toBe(204);
    const updatedArticle = await axios.get(`${shoppingArticlesEndpoint}/1`);
    expect(updatedArticle.data.category.id).toBe(2);
    const categories = await axios.get(categoriesEndpoint);
    expect(categories.data).toEqual([
      { id: 1, name: "beta" },
      { id: 2, name: "gamma" },
    ]);
  });

  test("DELETE /shoppingArticles/id should delete article", async () => {
    const response = await axios.delete(`${shoppingArticlesEndpoint}/2`);
    expect(response.status).toBe(204);
    const allArticles = await axios.get(shoppingArticlesEndpoint);
    expect(allArticles.data.length).toBe(3);
  });

  test("DELETE /shoppingArticles/id should return 404 if article not found", async () => {
    try {
      await axios.delete(`${shoppingArticlesEndpoint}/100`);
      throw new Error("Expected request to fail with 404, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toEqual("Shopping article not found");
    }
  });

  test("DELETE /shoppingArticles/id should remove category if unused", async () => {
    await axios.delete(`${shoppingCartEndpoint}/1`);
    const response = await axios.delete(`${shoppingArticlesEndpoint}/3`);
    expect(response.status).toBe(204);
    const categories = await axios.get(categoriesEndpoint);
    expect(categories.data).toEqual([
      { id: 2, name: "gamma" },
      { id: 3, name: "alpha" },
    ]);
  });

  test("DELETE /shoppingArticles/id should return 409 if article is in shopping cart", async () => {
    try {
      await axios.delete(`${shoppingArticlesEndpoint}/3`);
      throw new Error("Expected request to fail with 409, but it succeeded.");
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      expect(error.response.status).toBe(409);
      expect(error.response.data.message).toEqual("Article in shopping cart");
    }
  });
});
