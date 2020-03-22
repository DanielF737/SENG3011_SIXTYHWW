const sqlite = require('sqlite');
const fs = require('fs');

const DB_PATH = "../database/database.sqlite";
const DB_SCHEMA = "../database/schema.sql";

fs.existsSync(DB_PATH) ? fs.unlinkSync(DB_PATH) : null;
const schema = fs.readFileSync(DB_SCHEMA, "utf8");
sqlite.open(DB_PATH).then(conn => conn.exec(schema));