// Saves a article to the database.
function saveArticle(url, headline, main_text, date_of_pub) {
  const sqlite3 = require('sqlite3').verbose();

  // Opens up the database.
  let db = new sqlite3.Database('./database', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the database.');
  });
  
  // Formats the query.
  let query = 'insert into article(id, url, headline, main_text, date_of_publication) values ';
  query = query + `(NULL, "${url}", "${headline}", "${main_text}", "${date_of_pub}")`;

  // Inserts the article to the database.
  db.run(query);

  /*
  let lastArticle = -1;  
  let lastArticleQuery = 'SELECT id FROM Article WHERE id = (SELECT MAX(ID) FROM Article);';
  db.all(lastArticleQuery, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      lastArticle = row.id;
    });
  });
  */

  // Closes the database.
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

// Saves a report to the database.
function saveReport(disease, syndrome, event_date, location) {
  const sqlite3 = require('sqlite3').verbose();

  // Opens up the database.
  let db = new sqlite3.Database('./database', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the database.');
  });
  
  // Formats the query.
  let query = 'insert into report(id, disease, syndrome, event_date, location) values ';
  query = query + `(NULL, "${disease}", "${syndrome}", "${event_date}", "${location}")`;

  // Inserts the report to the database.
  db.run(query);

  // Closes the database.
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

// Retrieve X amount of articles from the database.
function retrieveArticles(amount) {
  const sqlite3 = require('sqlite3').verbose();

  // Opens up the database.
  let db = new sqlite3.Database('./database', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  // Closes the database.
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

// Retrieves X amount of reports from database.
function retrieveReports(amount) {
  const sqlite3 = require('sqlite3').verbose();

  // Opens up the database.
  let db = new sqlite3.Database('./database', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the database.');
  });

  let query = 'SELECT * FROM Report ORDER BY event'

  // Closes the database.
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}

let a = saveArticle("google.com", "corona", "stuff happened", "2020-12-12");
console.log(a);
//saveReport("Corona", "Stuff", "2000-12-12", "Sydney");