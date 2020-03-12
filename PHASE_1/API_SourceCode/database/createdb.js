const sqlite = require('sqlite');
const fs = require('fs');

const DB_NAME = "./database.sqlite";
const DB_SCHEMA = "./schema.sql";

fs.existsSync(DB_NAME) ? fs.unlinkSync(DB_NAME) : null;
const schema = fs.readFileSync(DB_SCHEMA, "utf8");
sqlite.open(DB_NAME).then(conn => conn.exec(schema));