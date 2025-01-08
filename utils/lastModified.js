const { LastModified } = require("../db/db");

async function updateLastModified(tableName) {
  await LastModified.destroy({
    where: {
      table_name: tableName,
    },
  });
  await LastModified.create({
    table_name: tableName,
    last_modified: new Date(),
  });
}

module.exports = updateLastModified;
