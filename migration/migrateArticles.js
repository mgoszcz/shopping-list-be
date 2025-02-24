const { shoppingArticlesEndpoint } = require("../tests/consts/urls");
const axios = require("axios");

const migrateArticles = async (oldArticles, categories) => {
  console.log("Articles migration started");
  console.log(`Articles to migrate: ${oldArticles.length}`);
  let i = 0;
  for (const article of oldArticles) {
    const category = categories.find((c) => c.name === article.category);
    try {
      await axios.post(shoppingArticlesEndpoint, {
        name: article.name,
        category: { id: category.id },
      });
      i++;
    } catch (error) {
      if (error.response.status === 409) {
        console.log(`Article ${article.name} ${article.category} exists`);
        i++;
      } else {
        throw new Error(error);
      }
    }
    console.log(`Migrated articles: ${i}`);
  }
  console.log("Fetching articles");
  const articles = await axios.get(shoppingArticlesEndpoint);
  const newArticles = articles.data;
  console.log("Articles migration completed");
  return newArticles;
};

module.exports = { migrateArticles };
