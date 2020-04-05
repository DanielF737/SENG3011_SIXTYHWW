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
    
    let options = {
      method: "POST",
      headers: {
          'Content-Type' : 'application/JSON'
      },
      body:JSON.stringify(reqBody)
    };  
    
    fetch(`${apiURL}/predict`, options)
    .then(r => r.json())
    .then(r => {
      console.log(r);
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
      console.log(r);
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
      console.log(r);
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
          <h1>Prediction</h1>
          <h2>Forcast for <strong>COVID-19</strong></h2>
        </div>
          <div className="feedObj">
          {results.map((obj,i) => {
            return (
              <div>
                <h4>{obj.location} in the next {obj.days} days</h4>
                <p>{obj.cases.prediction[1]} new cases</p>
                <p>{obj.deaths.prediction[1]} more deaths</p>
                <break></break>
              </div>
            )
          })}
          </div>
      </div>
    )
  }
}
export default Prediction;