const {
  shopsEndpoint,
  shopCategoriesEndpoint,
  currentShopEndpoint,
} = require("../tests/consts/urls");
const axios = require("axios");

const migrateShops = async (oldShops) => {
  console.log("Shops migration started");
  console.log(`Shops to migrate: ${oldShops.length}`);
  let i = 0;
  for (const shop of oldShops) {
    try {
      await axios.post(shopsEndpoint, {
        name: shop.name,
        logo: "logo",
      });
      i++;
    } catch (error) {
      if (error.response.status === 409) {
        console.log(`Shop ${shop.name}exists`);
        i++;
      } else {
        throw new Error(error);
      }
    }
    console.log(`Migrated shops: ${i}`);
  }
  console.log("Fetching shops");
  const shops = await axios.get(shopsEndpoint);
  const newShops = shops.data;
  console.log("Shops migration completed");
  return newShops;
};

const migrateShopsCategoryOrder = async (oldShops, newShops, categories) => {
  console.log("Shops category order migration started");
  console.log(`Shops to migrate: ${oldShops.length}`);
  for (const shop of oldShops) {
    console.log(`Migrating categories for shop ${shop.name}`);
    const newShop = newShops.find((s) => s.name === shop.name);
    let order = 1;
    let newCategoryOrder = [];
    for (const category of shop.category_list) {
      const newCategory = categories.find((c) => c.name === category);
      newCategoryOrder.push({
        category: { id: newCategory.id },
        category_order: order,
      });
      order++;
    }
    console.log(newCategoryOrder);
    await axios.put(shopCategoriesEndpoint(newShop.id), newCategoryOrder);
  }
  console.log("Shop categories migration completed");
};

const migrateCurrentShop = async (oldCurrentShop, newShops) => {
  console.log("Current shop migration started");
  const newCurrentShop = newShops.find((s) => s.name === oldCurrentShop);
  await axios.put(currentShopEndpoint, { shop_id: newCurrentShop.id });
  console.log("Current shop migration finished");
};

module.exports = {
  migrateShops,
  migrateShopsCategoryOrder,
  migrateCurrentShop,
};
