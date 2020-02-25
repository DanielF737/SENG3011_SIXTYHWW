// Creates all necessary tables within the database if it doesn't exist.
// Then fills in database with required information.

const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./database', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the database.');
});
 
db.run('create table if not exists Article (' +
  'url                   text not null,' +
  'headline              text,' +
  'main_text             text,' +
  'date_of_publication   date,' +
  'primary key           (url)' +
');');

db.run('create table  if not exists Report (' +
  'disease     text not null,' +
  'article     text not null,' +
  'syndrome    text,' +
  'event_date  date,' +
  'location    date,' +
  'primary key (disease)' +
');');

db.run('insert into article(url, headline, main_text, date_of_publication) values ("www.hello.com", "stuff", "a lot of stuff","2000-12-12")');

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});