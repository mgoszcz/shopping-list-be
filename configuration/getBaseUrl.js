require("dotenv").config();

const getBaseUrl = () => {
  const environment = process.env.ENVIRONMENT || "prod";
  if (environment === "local") {
    return "http://localhost:3001";
  } else if (environment === "development") {
    return "https://shopping-list-be-development.up.railway.app";
  } else if (environment === "production") {
    return "https://shopping-list-be.up.railway.app";
  } else {
    throw new Error(`Unknown environment: ${environment}`);
  }
};

module.exports = getBaseUrl;
