const sqlite = require('sqlite');
const conn;

/*
  Scraper
*/

async function addArticle(article) {
  const statement = await conn.run(`
    INSERT INTO articles (url, headline, body, date_of_publication)
    VALUES ($url, $headline, $body, $date)
    ON CONFLICT (url)
    DO UPDATE SET
    headline = excluded.headline,
    body = excluded.body,
    date_of_publication = excluded.date_of_publication
  `, {
    $url: article.url,
    $headline: article.headline,
    $body: article.main_text,
    $date: article.date_of_publication
  });

  article.reports.forEach((report) => addReport(statement.lastID, report));
}

async function addReport(id, report) {
  const statement = await conn.run(`
    INSERT INTO reports (article_id, diseases, syndromes, event_date, country, city, latitude, longitude)
    VALUES ($article_id, $disease, $syndrome, $event_date, $country, $city, $latitude, $longitude)
    ON CONFLICT (diseases, syndromes, event_date, country, city, longitude, latitude)
    DO UPDATE SET
    article_id = excluded.article_id,
    diseases = excluded.diseases,
    syndromes = excluded.syndromes,
    event_date = excluded.event_date,
    country = excluded.country,
    city = excluded.city,
    latitude = excluded.latitude,
    longitude = excluded.longitude
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
*/

async function search(searchRequest) {
  try {
    const key_terms = searchRequest.key_terms.split(",");

    const reports = await conn.all(`
      SELECT * FROM reports
      WHERE event_date > $start_date
      AND event_date < $end_date
      AND (country == $country OR city == $city)
    `, {
      $start_date: searchRequest.start_date,
      $end_date: searchRequest.end_date,
      $country: searchRequest.country,
      $city: searchRequest.city,
    });

    return reports.filter((report) => {
      var validReport = false;
      
      for (var i = 0; i < key_terms.length; i++) {
        if (report.headline.includes(key_terms[i])) {
          validReport = true;
          break;
        }
      }

      return validReport;
    });
  } catch (e){
    console.log(e);
    return [];
  }
}

async function getReports() {
  try {
    return await conn.all("SELECT * FROM reports");
  } catch (e){
    console.log(e);
    return [];
  }
}

module.exports = async () => {
  conn = await sqlite.open("../database/database.sqlite");

  return {
    "addArticle": addArticle,
    "addReport": addReport,
    "getReports": getReports,
    "search": search
  };
}