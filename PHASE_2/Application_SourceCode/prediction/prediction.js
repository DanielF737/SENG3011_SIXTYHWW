const regression = require("regression");
const wtn = require("words-to-numbers")
const fetch = require("node-fetch");

const diseaseAPI = "http://api.sixtyhww.com:3000";
const localAPI = "http://localhost:3000"
const extractWordCases = ["cases", "case", "positive"];
const extractWordDeaths = ["die", "death", "deaths", "dies", "dead"];
const totalWords = ["total", "totals", "toll", "tally", "tolls", "tallies", "already"]; 
const garbageWords = ["hours", "hour", "day", "days", "hrs"];

// Function wrapper for the whole program.
async function predictAll(location, disease, predictionDay) {
  try {
    return getReports(location, disease, predictionDay);
  } catch(e) {
    console.log(e);
    return {success: false};
  }
}

// Gets the required reports for a location and disease.
function getReports(location, disease, predictionDay) {
  // Sets up requirements for fetch.
  reqJSON = {
    "start_date": "2015-10-01T08:45:10",
    "end_date": "2020-11-01T19:37:12",
    "keyTerms": disease,
    "location": location
  };
  let points = [];
  let options = {
    method: "POST",
    headers: {
        'Content-Type' : 'application/JSON'
    },
    body:JSON.stringify(reqJSON)
  };  

  // Fetches data and returns prediction.
  return fetch(diseaseAPI + "/search", options)
  .then(r => r.json())
  .then(r => {
    points = reportToPoints(r);
    if (points.length > 0) {
      let finalPoints = convertParaToPoints(points);
      let results = prediction(finalPoints, predictionDay);
      return results;
    } else {
      return {success: false};
    }
  });
}

// Converts the dates and case numbers into proper points.
function reportToPoints(reports) {
  let points = []
  for (let i = 0; i < reports.length; i++) {    
    // Gets the date.
    let date = reports[i].date_of_publication.substring(0,10);

    // Get the state if applicable.
    let state = reports[i].reports[0].locations[0].city;

    // Gets the headline and converts any numbers written as words into integers.
    let headline = reports[i].headline;
    let newHeadline = wtn.wordsToNumbers(headline);

    // Removes unecessary data.
    let sepHeadline = stripHeadline(newHeadline);
    sepHeadline = removeGarbage(sepHeadline);
    sepHeadline = removeDuplicates(sepHeadline);

    // Groups together relevant information.
    let filteredInfo = filterInformation(sepHeadline);
    filteredInfo = organiseData(filteredInfo);

    // Only adds info that has data.
    if (filteredInfo.length >= 1) {
      // Date, X-Coord, Y-Coords, State/City
      let tmp = [date, 0, filteredInfo, state];
      points.push(tmp);
    }

  }

  // Sorts all the data into a more easily searchable format.
  points.sort(function(a, b) {
    // First sorts by date.
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    if (a[0] == b[0]) {
      // Sorts by state/city otherwise.
      if (a[3] > b[3]) return 1;
      if (a[3] < b[3]) return -1;
    }
    return 0;
  });

  return points;
}

// Converts dates to an x coordinate, and case/death numbers to y coordinates.
function convertParaToPoints(points) {
  let x = 0;
  let curDate = new Date(points[0][0]);
  for (let i = 0; i < points.length; i++) {
    let tmpDate = new Date(points[i][0]);
    if (tmpDate > curDate) {
      // Converts dates to x-coordinates.
      let diff = Math.abs(tmpDate - curDate);
      diff = Math.floor(((diff/1000)/86400));

      // Adds to the x-coordinate.
      x = x + diff;
      points[i][1] = x;
      curDate = tmpDate
    } else {
      points[i][1] = x;
    }
  }

  // Handles the y-coordinates for cases and deaths.
  x = 0;
  let finalPoints = [];
  let cases = 0; let deaths = 0;
  let totalCases = 0; let totalDeaths = 0;
  // Cycles through all data entries.
  for (let i = 0; i < points.length; i++) {
    // If the data entry has the same x-coordinate as the previous.
    if (points[i][1] == x) {
      // Cycles through all possible y-coordinates for the data entry.
      for (let j = 0; j < points[i][2].length; j++) {
        if (points[i][2][j][0] == "case") {
          // If the potential coordinate is for cases.
          if (points[i][2][j].length == 3) {
            // If the coordinate is for a total, not an addition.
            // New total must be greater than previous total.
            if (points[i][2][j][1] > totalCases) {
              cases += points[i][2][j][1] - totalCases;
            } else {
              cases += points[i][2][j][1];
            }
          } else {
            // Adds on number of cases.
            cases += points[i][2][j][1];
            totalCases += points[i][2][j][1];
          }
        } else if (points[i][2][j][0] == "death") {
          // If the potential coordinate is for deaths.
          if (points[i][2][j].length == 3) {
            // If the coordinate is for a total, not an addition.
            // New total must be greater than previous total.
            if (points[i][2][j][1] > totalDeaths) {
              deaths += points[i][2][j][1] - totalDeaths;
            } else {
              deaths += points[i][2][j][1];
            }
          } else {
            // Adds on number of deaths.
            deaths += points[i][2][j][1];
            totalDeaths += points[i][2][j][1];
          }
        }
      } 
    } else {
      // If there is a different x-coordinate than the previous.
      let tmp = [points[i-1][0], points[i-1][1], cases, deaths];
      finalPoints.push(tmp);
      // Sets up x for next iteration, and reverts i by one.
      deaths = 0;
      cases = 0;
      x = points[i][1];
      i--;
    }
  }
  return finalPoints;
}

// Strips the headline of all non-essential data.
function stripHeadline(sentence) {
  // Turns all characters into lower case and splits the string into an array
  // based on spaces, i.e. ' '.
  let newS = sentence.toLowerCase();
  let sentArr = newS.split(" ");
  
  // Cycles through all words and determines if they need to be kept.
  for (let i = sentArr.length - 1; i >= 0; i--) {
    // If word is similar to requirement, then remove or replace.
    if (extractWordCases.indexOf(sentArr[i]) != -1) {
      // If word is similar to case, then replace.
      sentArr[i] = "case";
    } else if (extractWordDeaths.indexOf(sentArr[i]) != -1) {
      // If word is similar to death, then replace.
      sentArr[i] = "death";
    } else if (garbageWords.indexOf(sentArr[i]) != -1) {
      // Notes down words associated with numbers that have no use.
      sentArr[i] = "garbage";
    } else if (totalWords.indexOf(sentArr[i]) != -1) {
      // Notes down words associated with numbers that have no use.
      sentArr[i] = "total";
    } else if (isNaN(sentArr[i])) {
      // If word is none of the above, and not a number then remove.
      sentArr.splice(i, 1);
    }
  }

  return sentArr;
}


function removeGarbage(strippedData) {
  // Removes garbage data such as time.
  for (let i = strippedData.length - 1; i > 0; i--) {
    // If first or second data is garbage, and the other is a number then remove.
    if ((strippedData[i] == "garbage" && !isNaN(strippedData[i-1])) || 
      (strippedData[i-1] == "garbage" && !isNaN(strippedData[i]))) {
      strippedData.splice(i-1,2);
    }
  }  
  return strippedData;
}

function removeDuplicates(strippedData) {
  // Remvoves consecutive duplicate data such as cases and cases.
  for (let i = strippedData.length - 1; i > 0; i--) {
    if ((strippedData[i] == "case" && strippedData[i-1] == "case") || 
    (strippedData[i] == "total" && strippedData[i-1] == "total") ||
    (strippedData[i] == "death" && strippedData[i-1] == "death")) {
      strippedData.splice(i, 1);
    }
  }
  return strippedData; 
}

// Organises all the information.
function filterInformation(sepHeadline) {
  let filteredInfo = [];

  // Handles edge case where only one input is provided.
  if (sepHeadline.length == 1) {
    if (sepHeadline[0] == "case") {
      filteredInfo.push(["case", 1]);
    } else if (sepHeadline[0] == "death") {
      filteredInfo.push(["death", 1]);
    }
    return filteredInfo; 
  }

  // Handles general cases.
  let cases = false; let deaths = false; let nums = false; let totals = false;
  let j = 0;
  for (let i = 0; i < sepHeadline.length; i++) {
    if (sepHeadline[i] == "case") {
      if (deaths == true || cases == true) {
        // Extracts required data and resets values.
        filteredInfo.push(extractInfo(j, i, sepHeadline));
        j = i;
        cases = false;
        deaths = false;
        nums = false;
        totals = false;
      } else {
        cases = true;
      }
    } else if (sepHeadline[i] == "death") {
      if (deaths == true || cases == true) {
        // Extracts required data and resets values.
        filteredInfo.push(extractInfo(j, i, sepHeadline));
        j = i;
        cases = false;
        deaths = false;
        nums = false;
        totals = false;
      } else {
        deaths = true;
      }
    } else if (sepHeadline[i] == "total") {
      if (totals == true) {
        // Extracts required data and resets values.
        filteredInfo.push(extractInfo(j, i, sepHeadline));
        j = i;
        cases = false;
        deaths = false;
        nums = false;
        totals = false;
      } else {
        totals = true;
      }
    } else if (!isNaN(sepHeadline[i])) {
      if (nums == true) {
        // Extracts required data and resets values.
        filteredInfo.push(extractInfo(j, i, sepHeadline));
        j = i;
        cases = false;
        deaths = false;
        nums = false;
        totals = false;
      } else {
        nums = true;
      }
    } 

    // If it reaches the last element, then extracts all the required data.
    if (i == sepHeadline.length - 1) {
      filteredInfo.push(extractInfo(j, i+1, sepHeadline));
    }
  }
  // Performs filtering of incorrect data.
  filteredInfo = removeImproperData(filteredInfo);
  filteredInfo = removeInsufficientData(filteredInfo);

  return filteredInfo;
}

// Removes data that was processed incorrectly and fixes issues in
// placement of data.
function removeImproperData(filteredInfo) {
  // Handles data that did not process properly.
  if (filteredInfo.length > 1) {
    for (let i = 0; i < filteredInfo.length; i++) {
      // If the there is a single entry for set of informations, then move
      // the last word from previous entry to current entry.
      if (i >= 1 && filteredInfo[i].length == 1 && filteredInfo[i-1].length >= 2 &&
        isNaN(filteredInfo[i-1][filteredInfo[i-1].length-1])) {
        let tmp = filteredInfo[i-1].pop();
        filteredInfo[i].push(tmp);
        if ((filteredInfo[i][0] == "total" && !isNaN(filteredInfo[i][1])) || 
          (filteredInfo[i][1] == "total" && !isNaN(filteredInfo[i][0]))) {

          // Cycles through previous and determines whether it is for cases or deaths.
          for (let l = 0; l < filteredInfo[i-1].length; l++) {
            if (filteredInfo[i-1][l] == "case" || filteredInfo[i-1][l] == "death") {
              filteredInfo[i].push(filteredInfo[i-1][l]);
              break;
            }
          }
        }
      }
    }
  }
  return filteredInfo;
}

// Removes data with insufficient information.
function removeInsufficientData(filteredInfo) {
  for (let i = filteredInfo.length-1; i >= 0; i--) {
    // Counts up all the information that are not numbers.
    let count = 0;
    for (let j = 0; j < filteredInfo[i].length; j++) {
      if (isNaN(filteredInfo[i][j])) count++;
    }
    // If it contains non-useful information it is removed.
    if (count == filteredInfo[i].length || filteredInfo[i].length == 1 || 
      filteredInfo[i].length > 3) {
      filteredInfo.splice(i, 1);
    }
  }
  return filteredInfo;
}

// Extracts the required information specifically from the headline.
function extractInfo(start, end, info) {
  let tmp = [];
  for (let k = start; k < end; k++) {
    if (!isNaN(info[k])) {
      tmp.push(parseInt(info[k]));
    } else {
      tmp.push(info[k]);
    }
  }
  return tmp;
}

// Organises the data entries to the appropriate format.
function organiseData(filteredData) {
  // Cycles through all data entries.
  for (let i = 0; i < filteredData.length; i++) {
    // Cycles through the data for each entry, and documents the information
    // for the entry through its index.
    let cases = -1; let deaths = -1; let nums = -1; let totals = -1;
    for (let j = 0; j < filteredData[i].length; j++) {
      if (filteredData[i][j] == "case") {
        cases = j;
      } else if (filteredData[i][j] == "death") {
        deaths = j;
      } else if (filteredData[i][j] == "total") {
        totals = j;
      } else if (!isNaN(filteredData[i][j])) {
        nums = j;
      }
    }

    // Re-adds the data based off indexes obtained in the correct order.
    let tmp = [];
    if (cases != -1) tmp.push("case");
    if (deaths != -1) tmp.push("death");
    if (nums != -1) tmp.push(filteredData[i][nums]);
    if (totals != -1) tmp.push("total");
    filteredData[i] = tmp;
  }
  return filteredData;
}

// Uses the data gathered to perform the prediction, and return a JSON.
function prediction(points, days) {
  let cases = [];
  let deaths = [];
  let xVal = 0;
  let caseDates = [];
  let deathDates = [];
  let successVal = false;

  // Gathers the points together.
  for (let i = 0; i < points.length; i++) {
    // If point is for cases.
    if (points[i][2] > 0) {
      cases.push([points[i][1], points[i][2]]);
      caseDates.push(points[i][0]);
    }

    // If point is for deaths.
    if (points[i][3] > 0) {
      deaths.push([points[i][1], points[i][3]]);
      deathDates.push(points[i][0]);
    }
    xVal = points[i][1];
  }
  let lastDate = "";
  if (caseDates[caseDates.length-1] > deathDates[deathDates.length-1]) {
    lastDate = caseDates[caseDates.length-1];
  } else {
    lastDate = deathDates[deathDates.length-1];
  }

  // Calculates the x-coordinate for the prediction.
  let curDate = new Date();
  curDate = curDate.toISOString().slice(0,10);
  let dateDiff = Math.abs(new Date(curDate) - new Date(lastDate));
  let diff = Math.floor((dateDiff/1000)/86400) + parseInt(xVal) + parseInt(days);

  // Gets the date for the prediction.
  let futureDate = new Date().getTime() + days * 86400000;
  futureDate = new Date(futureDate);
  futureDate = futureDate.toISOString().slice(0, 10);
  
  let casePred = {};
  // If there are sufficient points to generate a polynomial.
  if (cases.length >= 4) {
    // Creates the polynomial that best fits the data.
    let casePoly = regression.polynomial(cases, {order:4});
    // Formats all the relevant data for cases to send to frontend.
    casePred = {
      string: casePoly.string,
      points: casePoly.points,
      eqn: casePoly.equation,
      dates: caseDates,
      predictedDate: futureDate,
      prediction: casePoly.predict(diff)
    };
    successVal = true;
  } else {
    casePred = {
      string: "Insufficient Points"
    };
  }

  let deathPred = {};
  if (deaths.length >= 4) {
    // Creates the polynomial that best fits the data.
    let deathsPoly = regression.polynomial(deaths, {order:4});
    // Formats all the relevant data for deaths to send to frontend.
    deathPred = {
      string: deathsPoly.string,
      points: deathsPoly.points,
      eqn: deathsPoly.equation,
      dates: deathDates,
      predictedDate: futureDate,
      prediction: deathsPoly.predict(diff)
    };
    successVal = true;
  } else {
    deathPred = {
      string: "Insufficient Points"
    };
  }
  
  // If anything was successful.

  
  // Compiles the data for cases and deaths for frontend.
  let predPackage = {
    success: successVal,
    cases: casePred,
    deaths: deathPred
  };

  //console.log(predPackage);
  return predPackage;
}

module.exports.predictAll =  predictAll;
//predictAll("United States", "COVID", 5);