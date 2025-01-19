const axios = require("axios");
const {
  shoppingCartEndpoint,
  lastModifiedShoppingCartEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

const getTimestampBefore = async () => {
  let timestampBefore;
  try {
    timestampBefore = (await axios.get(lastModifiedShoppingCartEndpoint)).data
      .lastModified;
  } catch (error) {
    timestampBefore = 0;
  }
  return timestampBefore;
};

describe("Last modified endpoint for ShoppingCart", () => {
  test("POST adding new product to shopping cart should update last modified date of ShoppingCart table", async () => {
    const timestampBefore = await getTimestampBefore();
    await axios.post(shoppingCartEndpoint, {
      article: { id: 2 },
    });
    const response = await axios.get(lastModifiedShoppingCartEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("PUT updating product in shopping cart should update last modified date of ShoppingCart table", async () => {
    const timestampBefore = await getTimestampBefore();
    await axios.put(`${shoppingCartEndpoint}/1`, {
      quantity: 2,
    });
    const response = await axios.get(lastModifiedShoppingCartEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("DELETE removing product from shopping cart should update last modified date of ShoppingCart table", async () => {
    const timestampBefore = await getTimestampBefore();
    await axios.delete(`${shoppingCartEndpoint}/1`);
    const response = await axios.get(lastModifiedShoppingCartEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("DELETE ALL removing all products from shopping cart should update last modified date of ShoppingCart table", async () => {
    const timestampBefore = await getTimestampBefore();
    await axios.delete(shoppingCartEndpoint);
    const response = await axios.get(lastModifiedShoppingCartEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("DELETE ALL checked from shopping cart should update last modified date of ShoppingCart table", async () => {
    const timestampBefore = await getTimestampBefore();
    await axios.delete(shoppingCartEndpoint, {
      params: {
        checked: true,
      },
    });
    const response = await axios.get(lastModifiedShoppingCartEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("DELETE ALL unchecked from shopping cart should update last modified date of ShoppingCart table", async () => {
    const timestampBefore = await getTimestampBefore();
    await axios.delete(shoppingCartEndpoint, {
      params: {
        unchecked: true,
      },
    });
    const response = await axios.get(lastModifiedShoppingCartEndpoint);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });
});
