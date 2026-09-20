const { LastModified } = require("../db/db");

async function updateLastModified(tableName) {
  const previous = await LastModified.findByPk(tableName);
  const previousTimestamp = previous?.last_modified?.getTime() ?? 0;

  await LastModified.upsert({
    table_name: tableName,
    last_modified: new Date(Math.max(Date.now(), previousTimestamp + 1)),
  });
}

module.exports = updateLastModified;
