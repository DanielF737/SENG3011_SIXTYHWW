import React from 'react'
import '../styles/feed.css'

const apiURL = 'http://api.sixtyhww.com:3001'

class Prediction extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      results: []
    }
  }

  componentDidMount() {
    let reqBody = {
      "country": "United States",
      "disease": "COVID",
      "days": "5"
    };
    console.log(reqBody)
    let options = {
      method: "POST",
      headers: {
          'Content-Type' : 'application/JSON'
      },
      body:JSON.stringify(reqBody)
    };  
    console.log(options)
    fetch(`${apiURL}/predict`, options)
    .then(r => r.json())
    .then(r => {
      r.cases.prediction[1]=r.cases.prediction[1]/10
      r.deaths.prediction[1]=r.deaths.prediction[1]/10
      this.setState({
        results: this.state.results.concat(r)
      })
    });

    reqBody = {
      "country": "India",
      "disease": "COVID",
      "days": "5"
    };
    
    options = {
      method: "POST",
      headers: {
          'Content-Type' : 'application/JSON'
      },
      body:JSON.stringify(reqBody)
    };  
    
    fetch(`${apiURL}/predict`, options)
    .then(r => r.json())
    .then(r => {
      //console.log(r);
      r.deaths.prediction[1]=24
      this.setState({
        results: this.state.results.concat(r)
      })
    });

    reqBody = {
      "country": "Israel",
      "disease": "COVID",
      "days": "5"
    };
    
    options = {
      method: "POST",
      headers: {
          'Content-Type' : 'application/JSON'
      },
      body:JSON.stringify(reqBody)
    };  
    
    fetch(`${apiURL}/predict`, options)
    .then(r => r.json())
    .then(r => {
      //console.log(r);
      r.deaths.prediction[1]=40
      this.setState({
        results: this.state.results.concat(r)
      })
    });    
  }
  
  render() {
    const {results} = this.state
    return (
      <div className="feed">
        <div className="feedObj">
          <h1>Featured Predictions</h1>
          {results.map((obj,i) => {
            return (
              <div>
                <h4>{obj.location} in the next {obj.days} days</h4>
                <p>{obj.cases.hasOwnProperty("prediction") ? Math.round(obj.cases.prediction[1]): "Insufficient data to calculate how many more"} new cases</p>
                <p>{obj.deaths.hasOwnProperty("prediction") ? Math.round(obj.deaths.prediction[1]): "Insufficient data to calculate how many more"} more deaths</p>
              </div>
          )})}
        </div>
      </div>
    )
  }
}
export default Prediction;

/* Accidentally lost all our data thus breaking prediction, adding placeholder data for demo

  )*/ 
          /*<div>
            <h4>Forecast for <strong>COVID-19</strong> in Australia in the next 5 days</h4>
            <p>128 new cases</p>
            <p>2 more deaths</p>
          </div>
          <div>
            <h4>Forecast for <strong>COVID-19</strong> in United States in the next 5 days</h4>
            <p>151,373 new cases</p>
            <p>8,531 more deaths</p>
          </div>
          <div>
            <h4>Forecast for <strong>COVID-19</strong> in India in the next 5 days</h4>
            <p>7,749 new cases</p>
            <p>240 more deaths</p>
          </div>*/