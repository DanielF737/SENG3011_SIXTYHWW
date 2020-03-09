const sqlite = require('sqlite');

const DB_NAME = "./database.sqlite";	
const db = sqlite.open(DB_NAME);

/*
  Scraper
*/

async function addArticle(url, headline, body, date_of_publication) {
  const conn = await db;
  const articles = await conn.all("SELECT * FROM articles");

  return articles;
}

async function addReport() {
  const conn = await db;
  const articles = await conn.all("SELECT * FROM articles");

  return articles;
}

/*
  API
*/

async function search(searchRequest) {
  const conn = await db;
  const articles = await conn.all("SELECT * FROM articles");

  return articles;
}

module.exports = {
  "search": search
};