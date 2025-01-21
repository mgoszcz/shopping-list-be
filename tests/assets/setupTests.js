const axios = require("axios");
const { resetDatabaseEndpoint } = require("../consts/urls");

const resetDatabase = async (attempt = 1) => {
  try {
    const response = await axios.post(resetDatabaseEndpoint);
    if (response.status !== 204) {
      throw new Error("Failed to reset database");
    }
  } catch (error) {
    if (attempt > 3) {
      console.log(`Attempt ${attempt} to reset database failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await resetDatabase(attempt + 1);
    } else {
      throw error;
    }
  }
};

beforeEach(async () => {
  await resetDatabase();
}, 30000);
