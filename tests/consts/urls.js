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
const lastModifiedCategoriesEndpoint = `${lastModifiedTimestampEndpoint}/categories`;
const lastModifiedShoppingArticlesEndpoint = `${lastModifiedTimestampEndpoint}/shopping_articles`;
const lastModifiedShoppingCartEndpoint = `${lastModifiedTimestampEndpoint}/shopping_cart`;
const lastModifiedShopsEndpoint = `${lastModifiedTimestampEndpoint}/shops`;
const lastModifiedShopCategoriesEndpoint = `${lastModifiedTimestampEndpoint}/shop_categories`;
const lastModifiedCurrentShopEndpoint = `${lastModifiedTimestampEndpoint}/current_shop`;

module.exports = {
  categoriesEndpoint,
  currentShopEndpoint,
  shopsEndpoint,
  shopCategoriesEndpoint,
  shoppingArticlesEndpoint,
  shoppingCartEndpoint,
  lastModifiedTimestampEndpoint,
  lastModifiedCategoriesEndpoint,
  lastModifiedShoppingArticlesEndpoint,
  lastModifiedShoppingCartEndpoint,
  lastModifiedShopsEndpoint,
  lastModifiedShopCategoriesEndpoint,
  lastModifiedCurrentShopEndpoint,
};
