import React from 'react'
import '../styles/feed.css'

//const apiURL = 'http://api.sixtyhww.com:3001'
const apiURL = 'http://localhost:3001'

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
      "country": "United Kingdom",
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
      "country": "China",
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

    return (
      <div className="feed">
        <div className="feedObj">
          <h1>Prediction</h1>
          <h2>Forcast for <strong>COVID-19</strong> in the next 5 days</h2>
          <p>United States: 0 new cases, </p>
        </div>
      </div>
    )
  }
}
export default Prediction;