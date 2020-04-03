const express = require('express');
const bodyParser = require('body-parser');
const prediction = require('./prediction.js');

// Constants
const PORT = 3001;

// Init Express
const app = express();

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Middleware
app.use((req, res, next) => {
  req.startTime = new Date();
  next();
});

app.use(bodyParser.json());

app.get('/predict', async(req, res) => {
  console.log(req.query.country);
  console.log(req.query.disease);
  console.log(req.query.days);
  const results = await prediction.predictAll(req.query.country, req.query.disease, req.query.days);
  console.log(results);
  res.send(results);
});

// Run Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

