# SENG3011_SIXTYHWW

SIXTHWW's scraper, API and frontend for SENG3011.
Contains a web scraper that scrapes [https://outbreaks.globalincidentmap.com/](https://outbreaks.globalincidentmap.com/) into a database, that is then accessed by our public API

## API URL
[http://api.sixtyhww.com:3000](http://api.sixtyhww.com:3000)

## Getting Started - Scraper
To run the scraper:
 1. Navigate to `/PHASE_1/API_SourceCode`
 2. Run `npm install`
 3. Navigate to `./scripts`
 4. Run `node scraper.js` to run the scraper
 5. Run `node loadData.js` to load the output from the scraper into a database

We recommend creating a cron job to run these programs automatically to keep the database up to date.

## Getting Started - API
To run the API:

 1. Navigate to `/PHASE_1/API_SourceCode`
 2. Run `npm install`
 3. Run `npm start`

The server is now running and can be accessed on [localhost:3000](http://localhost:300)
We recommend using a process manager such as PM2 to keep the server proccess running when the shell is not open.

## Members
Daniel Ferraro z5204902
Joshua Murray z5207668
Niki Singh z5209322
Tim Thacker z5115699
