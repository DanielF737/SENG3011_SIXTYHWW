import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

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
    var query = "SELECT * FROM articles, reports WHERE articles.id == reports.article_id";

    var params = {};

    console.log(typeof searchRequest.start_date);

    if (searchRequest.start_date) {
      query += " AND event_date > $start_date";
      params.$start_date = searchRequest.start_date;

    }

    if (searchRequest.end_date) {
      query += " AND event_date < $end_date";
      params.$end_date = searchRequest.end_date;
    }

    if (searchRequest.location) {
      query += " AND (country == $location OR city == $location)";
      params.$location = searchRequest.location;
    }

    console.log(query);
    console.log(params);

    var reports = await conn.all(query, params);

    if (searchRequest.keyTerms) {
      const regex = new RegExp(searchRequest.keyTerms.trim().toLowerCase() ? searchRequest.keyTerms.trim().toLowerCase().replace(",", "|") : "", "i");

      reports = reports.filter((report) =>
        regex.test(report.headline.toLowerCase()) ||
        regex.test(report.body.toLowerCase()) ||
        regex.test(report.diseases.toLowerCase()) ||
        regex.test(report.syndromes.toLowerCase())
      );
    }

    if (searchRequest.pagination) {
      console.log("pagination")
      const values = searchRequest.pagination.split(",");
      if (values.length == 2) {
        const val1 = parseInt(values[0]);
        const val2 = parseInt(values[1]);
        console.log(val1);
        console.log(val2);

        if (val1 != NaN && val2 != NaN) {
          reports = reports.slice(val1, val2);
        }
      }
    }

    return reports;
  } catch (e){
    console.log(e);
    return null;
  }
}

async function getAllArticles(start,end) {
  try {
    let reports = await conn.all("SELECT * FROM articles, reports WHERE articles.id == reports.article_id ORDER BY articles.date_of_publication DESC")
    if(start >= 0 && end > start) {
      reports = reports.slice(start, end)
    }
    return reports;
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

/*

  Users

*/

async function register(username, password) {
  await conn.run(`
    INSERT INTO users (uname, pword)
    VALUES ($username, $password)
  `, {
    $username: username,
    $password: password
  });
}

async function login(username, password) {
  try {

    const user = await conn.get("SELECT * FROM users WHERE uname == $username", {
      $username: username
    });

    if (user.password !== password) throw "Incorrect password";

    const user = await conn.get("SELECT * FROM sessions WHERE user_id == $user_id", {
      $user_id: user.user_id
    });

    const token = uuidv4();

    await conn.run(`
      INSERT INTO sessions (token, user_id)
      VALUES ($token, $user_id)
    `, {
      $token: token,
      $user_id: user.user_id
    });

    return token;

  } catch (e){
    console.log(e);
    throw e;
  }
}

async function addLocationFollow(user_id, location_name) {
  await conn.run(`
    INSERT INTO location_follows (user_id, location_name)
    VALUES ($user_id, $location_name)
  `, {
    $user_id: user_id,
    $location_name: location_name
  });
}

async function addSyndromeOrDiseaseFollow(user_id, disease_or_syndrome) {
  await conn.run(`
    INSERT INTO disease_and_syndrome_follows (user_id, disease_or_syndrome)
    VALUES ($user_id, $disease_or_syndrome)
  `, {
    $user_id: user_id,
    $disease_or_syndrome: disease_or_syndrome
  });
}

export default async () => {
  conn = await open("../database/database.sqlite");

  return {
    "addArticle": addArticle,
    "addReport": addReport,
    "search": search,
    "getAllArticles": getAllArticles,
    "getArticle": getArticle,
    "deleteArticle": deleteArticle
  };
}
