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
  const results = await prediction.predictAll(req.country, req.disease, req.days);
  console.log(results);
  res.send(JSON.stringify(results));
  return;
});

// Run Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

