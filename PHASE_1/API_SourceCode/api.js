const express = require('express');
const bodyParser = require('body-parser');
const swagger = require('swagger-ui-express');
const swaggerDoc = require("yamljs").load("../API_Documentation/swag.yml");

// Import services
const dataService = require('./services/dataService.js');
const userService = require('./services/userService.js');
const loggingService = require('./services/loggingService.js');

// Constants
const PORT = 3000;
const API_KEY = "YeetSwag420";

// Init Express
const app = express();

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Swagger
app.use('/', swagger.serve)
app.get('/', swagger.setup(swaggerDoc))

// Middleware
app.use((req, res, next) => {
  req.startTime = new Date();
  next();
});

app.use(bodyParser.json());

// API Routes
app.post('/search', async (req, res) => {

  const reports = await dataService.search(req.body);

  if (reports) {
    reports.forEach(rep =>{
      rep.main_text = rep.body
      delete rep.body
      rep.reports = []
      rep.reports.push({'event_date': rep.event_date, 'locations': [{'country':rep.country, 'city':rep.city, 'latitude':rep.latitude, 'longitude':rep.longitude}],
      'diseases': rep.diseases, 'sydromes': rep.syndromes})
      delete rep.event_date;
      delete rep.country;
      delete rep.city;
      delete rep.latitude
      delete rep.longitude
      delete rep.diseases
      delete rep.syndromes
      delete rep.article_id
    });

    res.send(reports);
    loggingService.log("/search", req.startTime, JSON.stringify(req.body, null, 2), `200 - ${reports.length} reports found`);
  }

  else {
    res.sendStatus(400);
    loggingService.log("/search", req.startTime, JSON.stringify(req.body, null, 2), "400");
  }

});

app.post('/articles', async (req, res) => {

  if (req.headers.authorization != API_KEY) {
    res.sendStatus(401);
    loggingService.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), `401 - Invalid api key`);
    return;
  }

  const article = req.body;

  if (!(
    article.url &&
    article.date_of_publication &&
    article.headline &&
    article.main_text &&
    article.reports &&
    article.reports.event_date &&
    article.reports.location &&
    article.reports.diseases &&
    article.reports.sydromes)) {
      res.sendStatus(400);
      loggingService.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), `400 - Invalid article`);
      return;
  }

  const result = await dataService.addArticle(req.body);

  if (result) {
    res.send(reports);
    loggingService.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), `200 - OK`);
  }

  else {
    res.sendStatus(400);
    loggingService.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), "400");
  }

});

app.get('/articles', async (req, res) => {
  const start = req.query.start ? req.query.start : 0;
  const end = req.query.end ? req.query.end : 20;

  const articles = await dataService.getAllArticles(start, end);
  articles.forEach(rep =>{
    rep.main_text = rep.body
    delete rep.body

    rep.reports = []
    rep.reports.push({'event_date': rep.event_date, 'locations': [{'country':rep.country, 'city':rep.city, 'latitude':rep.latitude, 'longitude':rep.longitude}],
    'diseases': rep.diseases, 'sydromes': rep.syndromes})
    delete rep.event_date;
    delete rep.country;
    delete rep.city;
    delete rep.latitude
    delete rep.longitude
    delete rep.diseases
    delete rep.syndromes
    delete rep.article_id
  })
  if (articles) {
    res.send(articles);
    loggingService.log("GET /articles", req.startTime, JSON.stringify(req.body, null, 2), `200 - ${articles.length} articles found`);
  }

  else {
    res.sendStatus(400);
    loggingService.log("GET /articles", req.startTime, JSON.stringify(req.body, null, 2), `400`);
  }

});

app.get('/articles/:id', async (req, res) => {

  const id = parseInt(req.params.id);

  if (id == NaN) {
    res.sendStatus(400);
    loggingService.log("GET /articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `400 - Invalid id`);
    return;
  }

  const article = await dataService.getArticle(id);

  if (article) {
    res.send(article);
    loggingService.log("GET /articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `200- OK`);
  }

  else {
    res.sendStatus(400);
    loggingService.log("GET /articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `404 - Article not found`);
  }

});

app.delete('/articles/:id', async (req,res) => {

  if (req.headers.authorization != API_KEY) {
    res.sendStatus(401);
    loggingService.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), `401 - Invalid api key`);
    return;
  }

  const id = parseInt(req.params.id);

  if (id == NaN) {
    res.sendStatus(400);
    loggingService.log("/search", req.startTime, JSON.stringify(req.body, null, 2), `400 - No id provided`);
    return;
  }

  const article = await dataService.deleteArticle(id);

  if (article) {
    res.send(article);
    loggingService.log("/articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `200 - OK`);
  }

  else {
    res.sendStatus(400);
    loggingService.log("/articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `404`);
  }

});

app.post('/register', async (req, res) => {
  try {
    if (!req.body.username) throw "Username not given";
    if (!req.body.password) throw "Password not given";
    
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/login', async (req, res) => {
  await userService.login();
});

app.post('/logout', async (req, res) => {

});

app.post('/follow_country', async (req, res) => {

  req.headers.authorization

});

app.post('/follow_city', async (req, res) => {

});

app.post('/follow_disease_or_syndrome', async (req, res) => {

});

// Run Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));