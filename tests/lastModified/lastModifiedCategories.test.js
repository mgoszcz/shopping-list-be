const axios = require("axios");
const {
  lastModifiedTimestampEndpoint,
  categoriesEndpoint,
  shoppingArticlesEndpoint,
  shoppingCartEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Last modified endpoint for Categories", () => {
  test("adding new category should update last modified date of Categories table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/Categories`)
    ).data.lastModified;
    await axios.post(categoriesEndpoint, { name: "new category" });
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/Categories`,
    );
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("deleting category should update last modified date of Categories table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/Categories`)
    ).data.lastModified;
    await axios.delete(`${shoppingCartEndpoint}/1`);
    await axios.delete(`${shoppingArticlesEndpoint}/3`);
    const response = await axios.get(
      `${lastModifiedTimestampEndpoint}/Categories`,
    );
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });
});
