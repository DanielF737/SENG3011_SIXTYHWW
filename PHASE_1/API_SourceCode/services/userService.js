const conn = require('./dbService.js');
const { v4: uuidv4 } = require('uuid');

module.exports.register = async (username, password) => {
  await conn.run(`
    INSERT INTO users (uname, pword)
    VALUES ($username, $password)
  `, {
    $username: username,
    $password: password
  });
}

module.exports.login = async (username, password) => {
  try {

    const user = await conn.get("SELECT * FROM users WHERE uname == $username", {
      $username: username
    });

    if (user.password !== password) throw "Incorrect password";

    const session = await conn.get("SELECT * FROM sessions WHERE user_id == $user_id", {
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