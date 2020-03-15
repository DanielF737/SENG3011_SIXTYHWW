const fs = require('fs')
const db = require('../common/db');

const data = fs.readFileSync("../data/output.json");

JSON.parse(data).forEach((article) => {
  db.addArticle(article);
});
const logfile = require('fs');

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

const logline = "run logger at: " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ", " + data.length + " reports stored.";
logfile.appendFile('runlog.txt', logline, function (err) {
    if (err) throw err;
    console.log('Saved!');
});
