const fs = require("fs");

const DB_PATH = "./db/database.sqlite";

module.exports = async () => {
  if (fs.existsSync(`${DB_PATH}.bkp`)) {
    fs.unlinkSync(DB_PATH);
    fs.copyFileSync(`${DB_PATH}.bkp`, DB_PATH);
    fs.unlinkSync(`${DB_PATH}.bkp`);
  }
};
