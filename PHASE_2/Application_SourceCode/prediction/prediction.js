const regression = require("regression");
const wtn = require("words-to-numbers")
const fetch = require("node-fetch");

const diseaseAPI = "http://api.sixtyhww.com:3000";
const localAPI = "http://localhost:3000"
const extractWordCases = ["cases", "case", "positive"];
const extractWordDeaths = ["die", "death", "deaths", "dies", "dead"];
const totalWords = ["total", "totals", "toll", "tally", "tolls", "tallies", "already"]; 
const garbageWords = ["hours", "hour", "day", "days", "hrs"];
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
  fetch(diseaseAPI + "/search", options)
  .then(r => r.json())
  .then(r => {
    points = reportToPoints(r);
    let finalPoints = convertParaToPoints(points);
    //console.log(finalPoints);
    return finalPoints;
  });
}

// Converts the dates and case numbers into proper points.
function reportToPoints(reports) {
  let points = []
  for (let i = 0; i < reports.length; i++) {    
    // Gets the date.
    let date = reports[i].date_of_publication.substring(0,10);
    
    // Get the state if applicable.
    let state = reports[i].reports[0].location[0].city;

    // Gets the headline and converts any numbers written as words into integers.
    let headline = reports[i].headline;
    let newHeadline = wtn.wordsToNumbers(headline);

    // Removes unecessary data.
    let sepHeadline = stripHeadline(newHeadline);
    sepHeadline = removeGarbage(sepHeadline);
    sepHeadline = removeDuplicates(sepHeadline);
    //console.log(sepHeadline);
    // Groups together relevant information.
    let filteredInfo = filterInformation(sepHeadline);
    filteredInfo = organiseData(filteredInfo);

    // Only adds info that has data.
    if (filteredInfo.length >= 1) {
      // Date, X-Coord, Y-Coords, State/City
      let tmp = [date, 0, filteredInfo, state];
      console.log(tmp);
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
  //console.log(points);
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
  x = 0;
  let finalPoints = [];
  let cases = 0; let deaths = 0;
  for (let i = 0; i < points.length; i++) {
    if (points[i][1] == x) {
      for (let j = 0; j < points[i][2].length; j++) {
        if (points[i][2][j][0] == "case") {
          cases += points[i][2][j][1];
        } else if (points[i][2][j][0] == "death") {
          deaths += points[i][2][j][1];
        }
      } 
    } else {
      let tmp = [points[i][0], x, cases, deaths];
      finalPoints.push(tmp);
      x = points[i][1];
      cases = 0;
      deaths = 0;
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

getReports("sd", "");
/*
let str = "DISTRICT OF COLUMBIA - First COVID - 19 Death Confirmed In Winnebago County - 5 New Cases Also Confi";
str = wtn.wordsToNumbers(str);
str = stripHeadline(str);
str = removeGarbage(str);
console.log(str);
str = removeDuplicates(str);
console.log(str);
str = filterInformation(str);
console.log(str);
*/
/*
let x = [];
x = stripHeadline("ITALY - Coronavirus Live Updates - Italy Deaths Jump By 743 In 1 Day - Global Cases Top 400000");
console.log("ITALY - Coronavirus Live Updates - Italy Deaths Jump By 743 In 1 Day - Global Cases Top 400000");
console.log(x);
console.log("\n");

x = stripHeadline("ILLINOIS - 1 More COVID-19 Death In Illinois - 168 New Cases Saturday");
console.log("ILLINOIS - 1 More COVID-19 Death In Illinois - 168 New Cases Saturday");
console.log(x);
console.log("\n");

x = stripHeadline("ITALY - Italy Records Almost 1000 Coronavirus Deaths In 24 Hours");
console.log("ITALY - Italy Records Almost 1000 Coronavirus Deaths In 24 Hours");
console.log(x);
console.log("\n");

x = stripHeadline("AUSTRALIA - Australian COVID-19 Death Toll Rises To 12");
console.log("AUSTRALIA - Australian COVID-19 Death Toll Rises To 12");
console.log(x);
console.log("\n");

x = stripHeadline("FRANCE - 299 Deaths In 24 Hours Bring Total To 1995");
console.log("FRANCE - 299 Deaths In 24 Hours Bring Total To 1995");
console.log(x);
console.log("\n");

x = stripHeadline("SPAIN - Spains Coronavirus Death Toll Jumps 514 In 24 Hours");
console.log("SPAIN - Spains Coronavirus Death Toll Jumps 514 In 24 Hours");
console.log(x);
console.log("\n");

x = stripHeadline("SPAIN - Spain To Boost Coronavirus Testing As Deaths Surpass 1300");
console.log("SPAIN - Spain To Boost Coronavirus Testing As Deaths Surpass 1300");
console.log(x);
console.log("\n");

x = stripHeadline("ISRAEL - Israels Coronavirus Tally Up To 1238 - Another Spike In Serious Cases");
console.log("ISRAEL - Israels Coronavirus Tally Up To 1238 - Another Spike In Serious Cases");
console.log(x);
console.log("\n");

x = stripHeadline("BANGLADESH - 1 New Dengue Patient In Last 24 Hrs - DGHS");
console.log("BANGLADESH - 1 New Dengue Patient In Last 24 Hrs - DGHS");
console.log(x);
console.log("\n");

x = stripHeadline("ARGENTINA - It Is Estimated That There Are Already At Least 51 Cases Of Dengue In Metan");
console.log("ARGENTINA - It Is Estimated That There Are Already At Least 51 Cases Of Dengue In Metan");
console.log(x);
console.log("\n");
*/



// Initial run to determine contents of headline.
  /*
  let cases = 0;
  let deaths = 0;
  let nums = 0;
  let totals = 0;
  for (let i = 0; i < sepHeadline.length; i++) {
    if (sepHeadline[i] == "case") cases++;
    if (sepHeadline[i] == "death") deaths++;
    if (!isNaN(sepHeadline[i])) nums++;
    if (sepHeadline[i] == "total") totals++;
  }
  */
  /*
  let str = "Cases: " + cases.toString() + " Deaths: " + deaths.toString() + " Nums: " + nums.toString() + " Totals: " + totals.toString();
  console.log(str);
  */