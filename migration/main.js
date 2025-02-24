const jsonData = require("../db/backup.json");
const { migrateArticles } = require("./migrateArticles");
const { migrateCategories } = require("./migrateCategories");
const {
  migrateShops,
  migrateShopsCategoryOrder,
  migrateCurrentShop,
} = require("./migrateShops");

const runMigration = async () => {
  try {
    const categories = await migrateCategories(
      jsonData.shopping_list.categories
    );
    const articles = await migrateArticles(
      jsonData.shopping_list.shopping_articles_list,
      categories
    );
    const shops = await migrateShops(jsonData.shopping_list.shops);
    await migrateShopsCategoryOrder(
      jsonData.shopping_list.shops,
      shops,
      categories
    );
    await migrateCurrentShop(jsonData.shopping_list.current_shop, shops);
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1); // Exit with an error code
  }
};

runMigration().then(() => {
  console.log("Script execution finished.");
});
