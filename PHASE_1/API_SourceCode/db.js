const sqlite = require('sqlite');
	
const db = sqlite.open("./yeet.db");

async function search(searchRequest) {

  const conn = await db;
  const articles = await conn.all("SELECT * FROM articles");

  return articles;
}

module.exports = {
  "search": search
};