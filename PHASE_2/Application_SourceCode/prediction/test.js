const fetch = require("node-fetch");

reqJSON = {
  "country": "United States",
  "disease": "COVID",
  "days": "5"
};

let options = {
  method: "POST",
  headers: {
      'Content-Type' : 'application/JSON'
  },
  body:JSON.stringify(reqJSON)
};  

fetch("http://localhost:3000/predict", options)
.then(r => r.json())
.then(r => {
  console.log(r);
});