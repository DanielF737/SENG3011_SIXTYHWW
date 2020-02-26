// Creates all necessary tables within the database if it doesn't exist.
// Then fills in database with required information.

const sqlite3 = require('sqlite3').verbose();

// Opens up the database.
let db = new sqlite3.Database('./database', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the database.');
});
 
// Creates table for Articles.
db.run('create table if not exists Article (' +
  'url                   text not null,' +
  'headline              text,' +
  'main_text             text,' +
  'date_of_publication   date,' +
  'primary key           (url)' +
');');


// Creates table for reports.
db.run('create table if not exists Report (' +
  'id          integer not null,' +
  'disease     text not null,' +
  'syndrome    text,' +
  'event_date  date,' +
  'location    date,' +
  'primary key (id)' +
');');

// Creates table for link between article and reports.
db.run('create table if not exists Part_Of (' +
  'article_url   text not null,' +
  'report_id     integer not null,' +
  'foreign key   (article_url) references Article(url),' +
  'foreign key   (report_id) references Report(id)' +
');');

//db.run('insert into article(url, headline, main_text, date_of_publication) values ("www.hello.com", "stuff", "a lot of stuff","2000-12-12")');

// Closes the database.
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});