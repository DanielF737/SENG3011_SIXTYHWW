const fs = require('fs')
const db = require('../common/db');

const data = fs.readFileSync("../data/output.json");

JSON.parse(data).forEach((article) => {
  db.addArticle(article);
});