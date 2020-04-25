const conn = require('./dbService.js');
const { v4: uuidv4 } = require('uuid');

module.exports.register = async (username, password) => {
  try {
    await conn.run(`
      INSERT INTO users (uname, pword)
      VALUES ($username, $password)
    `, {
      $username: username,
      $password: password
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports.login = async (username, password) => {
  try {
    // Get user from database
    const user = await conn.get("SELECT * FROM users WHERE uname == $username", {
      $username: username
    });

    if (!user) throw "Invalid username";
    if (user.pword !== password) throw "Incorrect password";

    const session = await conn.get("SELECT * FROM sessions WHERE user_id == $user_id", {
      $user_id: user.id
    });

    // If an existing session token is there, return it
    if (session) return session.token;

    // Else create a new session token and return it
    const token = uuidv4();

    await conn.run(`
      INSERT INTO sessions (token, user_id)
      VALUES ($token, $user_id)
    `, {
      $token: token,
      $user_id: user.id
    });

    return token;

  } catch (e){
    console.log(e);
    throw e;
  }
}

module.exports.tokenToUserId = async (token) => {
  try{
    const session = await conn.get(`
      SELECT * FROM sessions WHERE token == $token
    `, {
      $token: token
    });

    if (!session || !session.user_id) throw "Invalid token";

    return session.user_id;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports.logout = async (token) => {
  try {

    // Get user from database
    await conn.run("DELETE FROM sessions WHERE token == $token", {
      $token: token
    });

  } catch (e){
    console.log(e);
    throw e;
  }
}

module.exports.addLocationFollow = async (user_id, location_name) => {
  try {
    await conn.run(`
      INSERT INTO location_follows (user_id, location_name)
      VALUES ($user_id, $location_name)
    `, {
      $user_id: user_id,
      $location_name: location_name
    });
  } catch (e) {
    console.log(e);
    throw (e);
  }
}

module.exports.addSyndromeOrDiseaseFollow = async (user_id, disease_or_syndrome) => {
  try{
    await conn.run(`
      INSERT INTO disease_and_syndrome_follows (user_id, disease_or_syndrome)
      VALUES ($user_id, $disease_or_syndrome)
    `, {
      $user_id: user_id,
      $disease_or_syndrome: disease_or_syndrome
    });
  } catch (e) {
    throw e;
  }
}

const getLocationFollows = async (user_id) => {
  try {
    const location_follows = await conn.all(`
      SELECT location_name
      FROM location_follows
      WHERE user_id == $user_id
    `, {
      $user_id: user_id
    });

    return location_follows.map(location => location.location_name);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

const getSyndromeOrDiseaseFollows = async (user_id) => {
  try {
    const disease_and_syndrome_follows = await conn.all(`
      SELECT disease_or_syndrome
      FROM disease_and_syndrome_follows
      WHERE user_id == $user_id
    `, {
      $user_id: user_id
    });

    return disease_and_syndrome_follows.map(diseaseOrSyndrome => diseaseOrSyndrome.disease_or_syndrome);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

module.exports.getFeed = async (user_id) => {
  try {
    const location_follows = await getLocationFollows(user_id);
    const disease_and_syndrome_follows = await getSyndromeOrDiseaseFollows(user_id);

    if ((location_follows.length + disease_and_syndrome_follows.length == 0))
      throw "Not following anything";

    // List of sqlite condition queries
    var conditions = [];

    // Add condition queries for locations
    location_follows
      .forEach(location =>
        conditions.push(`(country == '${location}' OR city == '${location}')`));
    
    // Add condition queries for diseases and syndromes
    disease_and_syndrome_follows
      .forEach(diseaseOrSyndrome =>
        conditions.push(`(diseases LIKE '%${diseaseOrSyndrome}%' OR syndromes == '%${diseaseOrSyndrome}%')`));

    // Build full conditions query
    var conditionsQuery = conditions[0];
    for (var i = 1; i < conditions.length; i++) {
      conditionsQuery += " OR " + conditions[i];
    }

    // Build the full query
    var query = `SELECT * FROM articles, reports WHERE articles.id == reports.article_id AND (${conditionsQuery})`;
    console.log(query);

    // Run query
    const reports = await conn.all(query);

    return reports;

  } catch (e) {
    console.log(e);
    throw e;
  }
}