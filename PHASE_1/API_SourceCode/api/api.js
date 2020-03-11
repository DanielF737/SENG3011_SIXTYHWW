const express = require('express');
const bodyParser = require('body-parser');
const db = require('../common/db');

// Constants
const PORT = 3000;

// Init Express
const app = express();

// Middleware
app.use(bodyParser.json());

/* 
  Routes
*/

// Root
app.get('/', (req, res) => res.send('Machine Learning API'));

// Search Route
app.get('/search', async (req, res) => {
  console.log(req.body);
  const articles = await db.search({});
  console.log(articles);
  res.send(articles);
});

// Run Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));