const fs = require("fs");

const DB_PATH = "./db/database.sqlite";

module.exports = () => {
  let f = 0;
  if (fs.existsSync(DB_PATH)) {
    console.log("DB exists creating backup");
    fs.copyFileSync(DB_PATH, `${DB_PATH}.bkp`);
  }
};
