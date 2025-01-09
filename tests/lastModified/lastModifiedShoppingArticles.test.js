const axios = require("axios");
const {
  lastModifiedTimestampEndpoint,
  shoppingArticlesEndpoint,
  shoppingCartEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Last modified endpoint for shoppingArticles", () => {
  test("POST adding new article should update last modified date of ShoppingArticles table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/ShoppingArticles`)
    ).data.lastModified;
    await axios.post(shoppingArticlesEndpoint, {
      name: "New Article",
      category: {
        id: 3,
      },
    });
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/ShoppingArticles`,
    );
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("PUT adding new article should update last modified date of ShoppingArticles table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/ShoppingArticles`)
    ).data.lastModified;
    await axios.put(`${shoppingArticlesEndpoint}/10`, {
      name: "New Article",
      category: {
        id: 3,
      },
    });
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/ShoppingArticles`,
    );
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("PUT updating article should update last modified date of ShoppingArticles table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/ShoppingArticles`)
    ).data.lastModified;
    await axios.put(`${shoppingArticlesEndpoint}/1`, {
      name: "Updated Article",
      category: {
        id: 3,
      },
    });
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/ShoppingArticles`,
    );
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("delete article should update last modified date of ShoppingArticles table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/ShoppingArticles`)
    ).data.lastModified;
    await axios.delete(`${shoppingArticlesEndpoint}/2`);
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/ShoppingArticles`,
    );
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });
});
