const conn = require('./dbService.js');
const { v4: uuidv4 } = require('uuid');

module.exports.tokenToUserId = async (token) => {
  const session = await conn.run(`
    SELECT * FROM sessions WHERE token == $token
  `, {
    $token: token
  });

  if (!session || !session.user_id) throw "Invalid token";

  return session.user_id;
}

module.exports.register = async (username, password) => {
  try {
    await conn.run(`
      INSERT INTO users (uname, pword)
      VALUES ($username, $password)
    `, {
      $username: username,
      $password: password
    });
  } catch {
    throw "Error registering user";
  }
}

module.exports.login = async (username, password) => {
  try {

    // Get user from database
    const user = await conn.get("SELECT * FROM users WHERE uname == $username", {
      $username: username
    });

    if (!user) throw "Invalid username";

    if (user.password !== password) throw "Incorrect password";

    const session = await conn.get("SELECT * FROM sessions WHERE user_id == $user_id", {
      $user_id: user.user_id
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
      $user_id: user.user_id
    });

    return token;

  } catch (e){
    console.log(e);
    throw e;
  }
}

module.exports.addLocationFollow = async (user_id, location_name) => {
  await conn.run(`
    INSERT INTO location_follows (user_id, location_name)
    VALUES ($user_id, $location_name)
  `, {
    $user_id: user_id,
    $location_name: location_name
  });
}

module.exports.addSyndromeOrDiseaseFollow = async (user_id, disease_or_syndrome) => {
  await conn.run(`
    INSERT INTO disease_and_syndrome_follows (user_id, disease_or_syndrome)
    VALUES ($user_id, $disease_or_syndrome)
  `, {
    $user_id: user_id,
    $disease_or_syndrome: disease_or_syndrome
  });
}

module.exports.getLocationFollows = async (user_id) => {
  try {
    const location_follows = await conn.all(`
      SELCT *
      FROM location_follows
      WHERE user_id == $user_id
    `, {
      $user_id: user_id
    });

    return location_follows;
  } catch (e) {
    console.log(e);
    throw "Error getting location follows";
  }
}

module.exports.getSyndromeOrDiseaseFollows = async (user_id) => {
  try {
    const disease_and_syndrome_follows = await conn.all(`
      SELCT *
      FROM disease_and_syndrome_follows
      WHERE user_id == $user_id
    `, {
      $user_id: user_id
    });

    return disease_and_syndrome_follows;
  } catch (e) {
    console.log(e);
    throw "Error getting syndrome and disease follows";
  }
}