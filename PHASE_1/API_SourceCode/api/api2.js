const express = require('express');
const bodyParser = require('body-parser');
const db = require('../common/db');
const YAML = require("yamljs")
const swagger = require('swagger-ui-express')
const swaggerDoc = YAML.load("../../API_Documentation/swag.yml")
// Constants
const PORT = 3000;

// Init Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Hardcoded stuff
article1 = {
  id: 0,
  url: 'afakeurl.com',
  date_of_publication: '2020-04-20 11:11:11',
  headline: 'This is a placeholder',
  main_text: 'Until we finish implementing endpoints!',
  reports: [
      {
      event_date: '2020-04-20 12:11:12',
        locations: [
          {
            country: "Australia",
            city: "Sydney",
            latitude: "idk how numbers work fam",
            longitude: "same"
          }
        ],
    diseases: ["unknown"],
    syndromes: ["Acute fever and rash"]
      }
  ],
};

article2 = {
  id: 1,
  url: 'afakeurl.com',
  date_of_publication: '2020-04-20 11:11:11',
  headline: 'This is a placeholder',
  main_text: 'Until we finish implementing endpoints!',
  reports: [
      {
      event_date: '2020-04-20 12:11:12',
        locations: [
          {
            country: "Australia",
            city: "Sydney",
            latitude: "idk how numbers work fam",
            longitude: "same"
          }
        ],
    diseases: ["unknown"],
    syndromes: ["Acute fever and rash"]
      }
  ],
};

articles = [article1,article2]

// Root
app.use('/', swagger.serve)
app.get('/', swagger.setup(swaggerDoc))

app.post('/search', async (req, res) => {
  //const articles = await db.search(req.body);
  res.send(articles);
});

app.put('/articles', async (req, res) =>{
  res.status(401).send('API key is missing or invalid')
})

app.get('/articles', async (req, res) => {
  let articles2 = []
  for (let i = 0; i < 20; i++){
    articles2.push(JSON.parse(JSON.stringify(article1)))
  }
  articles2.forEach((item, index) => {
    console.log(item, index)
    item.id=index;
    console.log(item, index)
  })
  res.send(articles2);
});

app.get('/articles/:id', async(req, res) => {
  id = req.params.id
  const yeet = JSON.parse(JSON.stringify(article1))
  yeet.id = id
  // jk xd
  res.send(yeet)
})

app.delete('/articles/:id', async(req,res) => {
  res.status(401).send('API key is missing or invalid')
})

// Run Server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));