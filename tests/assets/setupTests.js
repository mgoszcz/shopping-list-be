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
      await resetDatabase(attempt + 1);
      console.log(`Attempt ${attempt} to reset database failed, retrying...`);
    } else {
      throw error;
    }
  }
};

beforeEach(async () => {
  await resetDatabase();
}, 30000);
