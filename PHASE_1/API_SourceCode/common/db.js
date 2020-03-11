const sqlite = require('sqlite');

const DB_NAME = "../database/database.sqlite";	
const db = sqlite.open(DB_NAME);

/*
  Scraper
*/

async function addArticle(article) {
  const conn = await db;

  const statement = await conn.run("INSERT OR REPLACE INTO articles (url, headline, body, date_of_publication) values ($url, $headline, $body, $date)", {
    $url: article.url,
    $headline: article.headline,
    $body: article.main_text,
    $date: article.date_of_publication
  });

  const id = statement.lastID;

  article.reports.forEach((report) => addReport(id, report));
}

async function addReport(id, report) {
  const conn = await db;
  
  const statement = await conn.run(`
    INSERT OR REPLACE
    INTO reports (article_id, disease, syndrome, event_date, country, city, latitude, longitude)
    VALUES ($article_id, $disease, $syndrome, $event_date, $country, $city, $latitude, $longitude)
  `, {
    $article_id: id,
    $disease: report.diseases,
    $syndrome: report.syndromes, 
    $event_date: report.event_date, 
    $country: report.locations.country, 
    $city: report.locations.city, 
    $latitude: report.locations.latitude, 
    $longitude: report.locations.longitude
  });
}

/*
  API
*/

async function search(searchRequest) {
  const conn = await db;

  const articles = await conn.all(`
    SELECT * FROM articles
    WHERE event_date > $start_date
    AND event_date < $end_date
    AND country == $country
    AND city == $city
  `, {
    $start_date: searchRequest.start_date,
    $end_date: searchRequest.end_date,
    $key_terms: searchRequest.key_terms,
    $country: searchRequest.country,
    $city: searchRequest.city,
  });

  return articles;
}

module.exports = {
  "search": search
};