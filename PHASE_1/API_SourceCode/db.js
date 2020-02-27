const db = require('sqlite')

const dbPromise = db.open("yeet.db");

async function search(searchRequest) {
  const db = await dbPromise;
  const articles = await db.all('SELECT * FROM articles');
    
  return articles;
}

module.exports = {
  "search": search
};