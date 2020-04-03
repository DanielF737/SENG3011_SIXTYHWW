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

// API Call for prediction.
app.post('/predict', async(req, res) => {

  if (isNaN(req.body.days)) {
    res.status(400).send({error: "Days is invalid. It needs to be a number >= 1."});
    return;
  }

  // Checks if days provided is correct.
  if (req.body.days < 1) {
    res.status(401).send({error: "Days is invalid. Day should be >= 1."});
    return;
  }

  // Calls prediction.
  const results = await prediction.predictAll(req.body.country, req.body.disease, req.body.days);
  
  // If no entries are sent back for the country.
  if (results.success == false) {
    res.status(402).send({error: "Insufficient data for " + req.body.country + "."});
    return;
  }

  // Returns the respone.
  res.send(JSON.stringify(results));
  return;
});

// Run Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

