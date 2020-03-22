const express = require('express');
const bodyParser = require('body-parser');
const database = require('../common/db');
const swagger = require('swagger-ui-express');
const swaggerDoc = require("yamljs").load("../../API_Documentation/swag.yml");

// Constants
const PORT = 3000;

database().then((db) => {
  // Init Express
  const app = express();

  // Middleware
  app.use(bodyParser.json());

  // Swagger
  app.use('/', swagger.serve)
  app.get('/', swagger.setup(swaggerDoc))

  // API Routes
  app.post('/search', async (req, res) => {
    const reports = await db.search(req.body);
    res.send(reports);
  });

  app.put('/articles', async (req, res) =>{
    res.send();
  });
  
  app.get('/articles', async (req, res) => {
    res.send();
  });
  
  app.get('/articles/:id', async(req, res) => {
    res.send();
  });
  
  app.delete('/articles/:id', async(req,res) => {
    res.send();
  });

  // Run Server
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

}).catch((e) => {
  console.log(e);
});