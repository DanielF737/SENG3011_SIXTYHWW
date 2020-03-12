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
  const articles = await db.search(req.body);
  res.send(articles);
});

app.get('/reports', async (req, res) => {
  const articles = await db.getReports();
  res.send(articles);
});

// Run Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));