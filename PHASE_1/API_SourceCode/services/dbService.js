const sqlite = require('sqlite');

const conn = sqlite.open("./database/database.sqlite");

module.exports.run = async (query, values) => {
  const db = await conn;
  return await db.run(query, values);
}

module.exports.get = async (query, values) => {
  const db = await conn;
  return await db.get(query, values);
} 

module.exports.all = async (query, values) => {
  const db = await conn;
  return await db.all(query, values);
}