const axios = require("axios");
const {
  shopsEndpoint,
  lastModifiedTimestampEndpoint,
} = require("../consts/urls");
const { expect, describe } = require("@jest/globals");

describe("Last modified endpoint for Shops", () => {
  test("POST adding new shop should update last modified date of Shops table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/Shops`)
    ).data.lastModified;
    await axios.post(shopsEndpoint, {
      name: "New Shop",
      logo: "newlogo.jpg",
    });
    const response = await axios.get(`${lastModifiedTimestampEndpoint}/Shops`);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("PUT adding new shop should update last modified date of Shops table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/Shops`)
    ).data.lastModified;
    await axios.put(`${shopsEndpoint}/10`, {
      name: "New Shop",
      logo: "newlogo.jpg",
    });
    const response = await axios.get(`${lastModifiedTimestampEndpoint}/Shops`);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("PUT updating shop should update last modified date of Shops table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/Shops`)
    ).data.lastModified;
    await axios.put(`${shopsEndpoint}/1`, {
      name: "Updated Shop",
      logo: "updatedlogo.jpg",
    });
    const response = await axios.get(`${lastModifiedTimestampEndpoint}/Shops`);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });

  test("delete shop should update last modified date of Shops table", async () => {
    const timestampBefore = (
      await axios.get(`${lastModifiedTimestampEndpoint}/Shops`)
    ).data.lastModified;
    await axios.delete(`${shopsEndpoint}/1`);
    const response = await axios.get(`${lastModifiedTimestampEndpoint}/Shops`);
    expect(response.data.lastModified).not.toBe(timestampBefore);
  });
});
