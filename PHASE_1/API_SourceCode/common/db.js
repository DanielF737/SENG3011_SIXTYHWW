const sqlite = require('sqlite');

const DB_NAME = "../database/database.sqlite";	
const db = sqlite.open(DB_NAME);

/*
  Scraper
*/

async function addArticle(article) {
  const conn = await db;

  const statement = await conn.run(`
    INSERT OR REPLACE
    INTO articles (url, headline, body, date_of_publication)
    VALUES ($url, $headline, $body, $date)`, {
    $url: article.url,
    $headline: article.headline,
    $body: article.main_text,
    $date: article.date_of_publication
  });

  article.reports.forEach((report) => addReport(statement.lastID, report));
}

async function addReport(id, report) {
  const conn = await db;

  console.log(report);
  
  const statement = await conn.run(`
    INSERT OR REPLACE
    INTO reports (article_id, diseases, syndromes, event_date, country, city, latitude, longitude)
    VALUES ($article_id, $disease, $syndrome, $event_date, $country, $city, $latitude, $longitude)
  `, {
    $article_id: id,
    $disease: JSON.stringify(report.diseases),
    $syndrome: JSON.stringify(report.syndromes), 
    $event_date: report.event_date, 
    $country: report.locations[0].country,
    $city: report.locations[0].city, 
    $latitude: report.locations[0].latitude, 
    $longitude: report.locations[0].longitude
  });
}

/*
  API

  `
    SELECT * FROM reports
    WHERE event_date > $start_date
    AND event_date < $end_date
    AND country == $country
    AND city == $city
  `

  const articles = await conn.all("SELECT * FROM reports", {
      $start_date: searchRequest.start_date,
      $end_date: searchRequest.end_date,
      $key_terms: searchRequest.key_terms,
      $country: searchRequest.country,
      $city: searchRequest.city,
    });
*/

async function search(searchRequest) {
  try {
    const conn = await db;

    searchRequest.key_terms = searchRequest.key_terms.split(",");

    const articles = await conn.all(`
      SELECT * FROM reports
      WHERE event_date > $start_date
      AND event_date < $end_date
      AND country == $country
      AND city == $city
    `, {
      $start_date: searchRequest.start_date,
      $end_date: searchRequest.end_date,
      $country: searchRequest.country,
      $city: searchRequest.city,
    });

    return articles;
  } catch (e){
    console.log(e);
    return [];
  }
}

async function getReports() {
  try {
    const conn = await db;

    const articles = await conn.all("SELECT * FROM reports");

    return articles;
  } catch (e){
    console.log(e);
    return [];
  }
}

module.exports = {
  "addArticle": addArticle,
  "addReport": addReport,
  "getReports": getReports,
  "search": search
};