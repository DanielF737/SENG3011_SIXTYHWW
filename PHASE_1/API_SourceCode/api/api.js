const express = require('express');
const bodyParser = require('body-parser');
const database = require('../common/db');
const swagger = require('swagger-ui-express');
const swaggerDoc = require("yamljs").load("../../API_Documentation/swag.yml");
const logger = require("../common/logger");

// Constants
const PORT = 3000;
const API_KEY = "YeetSwag420";

database().then((db) => {
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

    const reports = await db.search(req.body);

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
      logger.log("/search", req.startTime, JSON.stringify(req.body, null, 2), `200 - ${reports.length} reports found`);
    }

    else {
      res.sendStatus(400);
      logger.log("/search", req.startTime, JSON.stringify(req.body, null, 2), "400");
    }

  });

  app.post('/articles', async (req, res) => {

    if (req.headers.authorization != API_KEY) {
      res.sendStatus(401);
      logger.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), `401 - Invalid api key`);
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
        logger.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), `400 - Invalid article`);
        return;
    }

    const result = await db.addArticle(req.body);

    if (result) {
      res.send(reports);
      logger.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), `200 - OK`);
    }

    else {
      res.sendStatus(400);
      logger.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), "400");
    }

  });

  app.get('/articles', async (req, res) => {
    const start = req.query.start ? req.query.start : 0;
    const end = req.query.end ? req.query.end : 20;

    const articles = await db.getAllArticles(start, end);
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
      logger.log("GET /articles", req.startTime, JSON.stringify(req.body, null, 2), `200 - ${articles.length} articles found`);
    }

    else {
      res.sendStatus(400);
      logger.log("GET /articles", req.startTime, JSON.stringify(req.body, null, 2), `400`);
    }

  });

  app.get('/articles/:id', async(req, res) => {

    const id = parseInt(req.params.id);

    if (id == NaN) {
      res.sendStatus(400);
      logger.log("GET /articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `400 - Invalid id`);
      return;
    }

    const article = await db.getArticle(id);

    if (article) {
      res.send(article);
      logger.log("GET /articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `200- OK`);
    }

    else {
      res.sendStatus(400);
      logger.log("GET /articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `404 - Article not found`);
    }

  });

  app.delete('/articles/:id', async(req,res) => {

    if (req.headers.authorization != API_KEY) {
      res.sendStatus(401);
      logger.log("POST /articles", req.startTime, JSON.stringify(req.body, null, 2), `401 - Invalid api key`);
      return;
    }

    const id = parseInt(req.params.id);

    if (id == NaN) {
      res.sendStatus(400);
      logger.log("/search", req.startTime, JSON.stringify(req.body, null, 2), `400 - No id provided`);
      return;
    }

    const article = await db.deleteArticle(id);

    if (article) {
      res.send(article);
      logger.log("/articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `200 - OK`);
    }

    else {
      res.sendStatus(400);
      logger.log("/articles/:id", req.startTime, JSON.stringify(req.body, null, 2), `404`);
    }

  });

  // Run Server
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

}).catch((e) => {
  console.log(e);
});
