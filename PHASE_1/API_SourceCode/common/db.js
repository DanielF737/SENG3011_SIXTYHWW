const sqlite = require('sqlite');

var conn;

async function addArticle(article) {

  try {
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

    article.reports.forEach(async (report) => await addReport(statement.lastID, report));

    return true;
  }
  
  catch (e) {
    console.log(e);

    return false;
  }
}

async function addReport(id, report) {
  const statement = await conn.run(`
    INSERT INTO reports (article_id, diseases, syndromes, event_date, country, city, latitude, longitude)
    VALUES ($article_id, $disease, $syndrome, $event_date, $country, $city, $latitude, $longitude)
    ON CONFLICT (diseases, syndromes, event_date, country, city, longitude, latitude)
    DO UPDATE SET
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

async function search(searchRequest) {
  try {
    var query = `
      SELECT * FROM articles, reports
      WHERE articles.id == reports.article_id
      AND event_date > $start_date
      AND event_date < $end_date
    `;

    if (searchRequest.location)
      query += `AND (country == $location OR city == $location)`;

    const reports = await conn.all(query, {
      $start_date: searchRequest.start_date,
      $end_date: searchRequest.end_date,
      $location: searchRequest.location
    });

    const regex = new RegExp(searchRequest.key_terms ? searchRequest.key_terms.replace(",", "|") : "", "i");

    return reports.filter((report) =>
      regex.test(report.headline) ||
      regex.test(report.body) ||
      regex.test(report.diseases) ||
      regex.test(report.syndromes)
    );
  } catch (e){
    console.log(e);
    return null;
  }
}

async function getAllArticles(n) {
  try {
    return await conn.all("SELECT * FROM articles LIMIT $n", {
      $n: n
    });
  } catch (e){
    console.log(e);
    return null;
  }
}

async function getArticle(id) {
  try {
    return await conn.get("SELECT * FROM articles WHERE id == $id", {
      $id: id
    });
  } catch (e){
    console.log(e);
    return null;
  }
}

async function deleteArticle(id) {
  try {
    await conn.run("DELETE FROM articles WHERE id == $id", {
      $id: id
    });
  } catch (e){
    console.log(e);
  }
}

module.exports = async () => {
  conn = await sqlite.open("../database/database.sqlite");

  return {
    "addArticle": addArticle,
    "addReport": addReport,
    "search": search,
    "getAllArticles": getAllArticles,
    "getArticle": getArticle,
    "deleteArticle": deleteArticle
  };
}