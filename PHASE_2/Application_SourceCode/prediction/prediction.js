const regression = require("regression");
const wtn = require("words-to-numbers")
const fetch = require("node-fetch");

const diseaseAPI = "http://api.sixtyhww.com:3000";
const localAPI = "http://localhost:3000"
const extractWordCases = ["cases", "case", "new", "positive"];
const extractWordDeaths = ["die", "death", "deaths", "dies"];
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
    "location": "United States"
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
    //console.log(points);
    return points;
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
    console.log(sepHeadline);
    // Groups together relevant information.
    let filteredInfo = filterInformation(sepHeadline);
    console.log(filteredInfo);
    //console.log(headline);
    //console.log("\n");
    let tmp = [date, sepHeadline, state];
    points.push(tmp);
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

  // Handles edge cases with only words.
  if (sepHeadline.length == 2) {

  } else if (sepHeadline == 3) {
    
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
    } else if (sepHeadline[i] == "deaths") {
      if (deaths == true || cases == true) {
        // Extracts required data and resets values.
        filteredInfo.push(extractInfo(j, i, sepHeadline));
        j = i;
        cases = false;
        deaths = false;
        nums = false;
        totals = false;
      } else {
        death = true;
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

  // Handles data that did not process properly.
  if (filteredInfo.length > 1) {
    for (let i = 0; i < filteredInfo.length; i++) {
      if (i >= 1 && filteredInfo[i].length == 1 && filteredInfo[i-1].length >= 2) {
        let tmp = filteredInfo[i-1].pop();
        filteredInfo[i].push(tmp);
      }
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

getReports("sd", "");

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