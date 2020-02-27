// Libraries
const express = require('express');
const bodyParser = require('body-parser');

// Imports
const db = require('./db.js');

// Constants
const port = 3000;

// Init Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes

// Root
app.get('/', (req, res) => res.send('Machine Learning API'));

// Search Route
app.get('/search', async (req, res) => {
  console.dir(req.body);
  const articles = await db.search({});
  res.send(articles);
});

// Run Server
app.listen(port, () => console.log(`Listening on port ${port}`));