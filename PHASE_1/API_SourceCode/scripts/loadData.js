const fs = require('fs')
const database = require('../common/db');

const data = fs.readFileSync("../data/output.json");

database().then((db) => {
  JSON.parse(data).forEach((article) => {
    db.addArticle(article);
  });
}).catch((e) => {
  console.log(e);
});