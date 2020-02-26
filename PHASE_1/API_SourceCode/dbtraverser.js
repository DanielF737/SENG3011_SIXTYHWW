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

// Saves a link between an article and a report.
function savePartOf(articleID, reportID) {
  const sqlite3 = require('sqlite3').verbose();

  // Opens up the database.
  let db = new sqlite3.Database('./database', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the database.');
  });
  
  // Formats the query.
  let query = 'insert into part_of(article_id, report_id) values ';
  query = query + `("${articleID}", "${reportID}")`;

  // Inserts the part_of link between report and article to the database.
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

}

// Retrieves X amount of reports from database.
function retrieveReports(amount) {

}

saveArticle("google.com", "corona", "stuff happened", "2020-12-12");
saveReport("Corona", "Stuff", "2000-12-12", "Sydney");
savePartOf(1,1);