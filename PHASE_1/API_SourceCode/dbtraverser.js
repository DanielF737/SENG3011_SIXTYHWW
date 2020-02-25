const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./tmp', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the tmp SQlite database.');
});
 
db.serialize(() => {
  db.each('SELECT * FROM ARTICLE', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
  })
});

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});