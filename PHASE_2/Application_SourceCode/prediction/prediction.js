const regression = require("regression");
const wtn = require("words-to-numbers")
const fetch = require('node-fetch');

const diseaseAPI = "http://api.sixtyhww.com:3000";
const extractWordCases = ["cases", "case"];
const extractWordDeaths = ["die", "death", "deaths", "dies"];
// Holds all the points.
let data = [];

// Gets the required reports for a location and disease.
function getReports(location, disease) {
  reqJSON = {
    "start_date": "2015-10-01T08:45:10",
    "end_date": "2020-11-01T19:37:12",
    "keyTerms": "COVID",
    "location": "Italy"
  };
  let points = [];
  let options = {
    method: "POST",
    headers: {
        'Content-Type' : 'application/JSON'
    },
    body:JSON.stringify(reqJSON)
  };  
  fetch("http://api.sixtyhww.com:3000/search", options)
  .then(r => r.json())
  .then(r => {
    points = reportToPoints(r);
    return points;
  });
}

// Converts the dates and case numbers into proper points.
function reportToPoints(reports) {
  let points = []
  for (i = 0; i < reports.length; i++) {
    // Gets the date.
    let date = reports[i].date_of_publication.substring(0,10);
    // Gets the headline and converts any numbers written as words into integers.
    let headline = reports[i].headline;
    let newHeadline = wtn.wordsToNumbers(headline);
    console.log(headline);
    console.log(newHeadline);
    console.log("\n");
  }
  return points;
}

// Strips the headline of all non-essential data.
function stripHeadline(sentence) {
  // Turns all characters into lower case and splits the string into an array
  // based on spaces, i.e. ' '.
  let newS = sentence.toLowerCase();
  let sentArr = newS.split(" ");
  
  // Cycles through all words and determines if they need to be kept.
  for (i = sentArr.length - 1; i >= 0; i--) {
    // If word is similar to requirement, then remove or replace.
    if (extractWordCases.indexOf(sentArr[i]) != -1) {
      // If word is similar to case, then replace.
      sentArr[i] = "case";
    } else if (extractWordDeaths.indexOf(sentArr[i]) != -1) {
      // If word is similar to death, then replace.
      sentArr[i] = "death";
    } else if (isNaN(sentArr[i])) {
      // If word is none of the above, and not a number then remove.
      sentArr.splice(i, 1);
    }
  }
  console.log(sentArr);
}

/*
function removeExcess(strippedData) {
  for (i = sentArr.length - 1; i >= 0; i++) {
    
  }
}
*/
//data = getReports();
stripHeadline("ITALY - Coronavirus Live Updates - Italy Deaths Jump By 743 In 1 Day - Global Cases Top 400000");
stripHeadline("ILLINOIS - 1 More COVID-19 Death In Illinois - 168 New Cases Saturday");