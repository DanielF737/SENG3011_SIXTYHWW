const express = require('express');
const bodyParser = require('body-parser');
//const db = require('common/db');
const YAML = require("yamljs")
const swagger = require('swagger-ui-express')
const swaggerDoc = YAML.load("../API_Documentation/swag.yml")
// Constants
const PORT = process.env.PORT || 3000;

// Init Express
const app = express();

// Middleware
app.use(bodyParser.json());
/*
  Routes
*/

// Root
app.use('/', swagger.serve)
app.get('/', swagger.setup(swaggerDoc))

app.get('/search', async (req, res) => {
  //const articles = await db.search(req.body);
  //res.send(articles);
});
/**
 * @swagger
 *
*/

app.get('/reports', async (req, res) => {
  //const articles = await db.getReports();
  //res.send(articles);
});

// Run Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
