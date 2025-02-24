const { categoriesEndpoint } = require("../tests/consts/urls");
const axios = require("axios");

const migrateCategories = async (oldCategories) => {
  console.log("Categories migration started");
  console.log(`Categories to migrate: ${oldCategories.length}`);
  let i = 0;
  for (const category of oldCategories) {
    try {
      await axios.post(categoriesEndpoint, {
        name: category,
      });
      i++;
    } catch (error) {
      if (error.response.status === 409) {
        console.log(`Category ${category} exists`);
        i++;
      } else {
        throw new Error(error);
      }
    }
    console.log(`Migrated categories: ${i}`);
  }
  console.log("Fetching categories");
  const allCategories = await axios.get(categoriesEndpoint);
  const newCategories = allCategories.data;
  console.log("Categories migration completed");
  return newCategories;
};

module.exports = { migrateCategories };
