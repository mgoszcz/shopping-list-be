const localBaseUrl = "http://localhost:3000";
const baseUrl = localBaseUrl;
const categoriesEndpoint = `${baseUrl}/categories`;
const currentShopEndpoint = `${baseUrl}/currentShop`;
const shopsEndpoint = `${baseUrl}/shops`;
const shopCategoriesEndpoint = (shopId) =>
  `${baseUrl}/shops/${shopId}/categories`;
const shoppingArticlesEndpoint = `${baseUrl}/shoppingArticles`;
const shoppingCartEndpoint = `${baseUrl}/shoppingCart`;
const lastModifiedTimestampEndpoint = `${baseUrl}/lastModifiedTimestamp`;

module.exports = {
  categoriesEndpoint,
  currentShopEndpoint,
  shopsEndpoint,
  shopCategoriesEndpoint,
  shoppingArticlesEndpoint,
  shoppingCartEndpoint,
  lastModifiedTimestampEndpoint,
};
