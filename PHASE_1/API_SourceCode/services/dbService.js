const sqlite = require('sqlite');

const conn = sqlite.open("./database/database.sqlite");

module.exports.run = async (query, values) => {
  await conn;
  return await conn.run(query, values);
}

module.exports.get = async (query, values) => {
  await conn;
  return await conn.get(query, values);
} 

module.exports.all = async (query, values) => {
  await conn;
  return await conn.all(query, values);
}