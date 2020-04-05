import React from 'react'
import '../styles/feed.css'
import '../styles/App.css';
import MapContainer from './map'

//const mattsToken = "AOYyHmVa91VOLs5ktY5LV1TUowA2"
//const mattsURL = 'https://sympt-server.herokuapp.com'

//const mipsToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhbmllbEBmZXJyYS5ybyIsInZlcmlmeSI6ImhleWhleWhleSIsImV4cCI6MTU4NTk4OTEwNX0.iHlHi5PSQGN7iJV257MQolx7WDnKGyuu5btLfGMj-l8"
//const mipsURL = "https://audbotb4h3.execute-api.ap-southeast-2.amazonaws.com/dev"

const apiURL = 'http://api.sixtyhww.com:3000'

class Search extends React.Component {
  constructor () {
    super();
    this.state = {
      results: []
    };
  }


  componentDidMount() {
    const { params } = this.props.match
    
    let currentDate = new Date();
    let d = currentDate.getDate();
    let m = currentDate.getMonth() + 1;
    let y = currentDate.getFullYear();
    let h = currentDate.getHours();
    let min = currentDate.getMinutes();
    let s = currentDate.getSeconds();
    let current = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + 'T' + (h <= 9 ? '0' + h : h) + ':'+ (min <= 9 ? '0' + min : min) + ':'+ (s <= 9 ? '0' + s : s)
    
    let startDate = new Date("1 January 2000 00:00 UTC");
    d = startDate.getDate();
    m = startDate.getMonth() + 1;
    y = startDate.getFullYear();
    h = startDate.getHours();
    min = startDate.getMinutes();
    s = startDate.getSeconds();
    let start = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + 'T' + (h <= 9 ? '0' + h : h) + ':'+ (min <= 9 ? '0' + min : min) + ':'+ (s <= 9 ? '0' + s : s)

    console.log(start + ' ' + current)

    let reqBody = {
      "start_date": start,
      "end_date": current,
      "keyTerms": params.disease,
      "location": params.country
    }

    console.log(reqBody)

    let options = {
      method: "POST",
      headers: {
          'Content-Type' : 'application/JSON'
      },
      body: JSON.stringify(reqBody)
    }
    
    fetch(`${apiURL}/search`, options)
    .then(r=> r.json())
    .then(r => {
        console.log(r)
        this.setState({
          results:this.state.results.concat(r.reverse())
        })
    })
  }

  render() {
    const { params } = this.props.match

    let {results} = this.state;
    console.log("these are what we got")
    console.log({results})
    console.log("length is " + results.length)
    if (results.length === 0) {
      console.log("got here")
      return (
        <div className="feedObj">
          <h4>No results for {params.disease} in {params.country}</h4>
        </div>
      );
    } else {
      return (
        <div className="pageBody">
          <div className="feed">
            <h2>Results for {params.disease} in {params.country}</h2>
            {results.map((obj, i) => {
                return (
                  <div className="feedObj" key={i}>
                    <h4>{obj.headline}</h4>
                    <p><a href={obj.url}>View the original source</a></p>
                    <p>{obj.date_of_publication}</p>
                    <p>{obj.main_text}</p>
                    <br></br>
                  </div>
                )
            })}
          </div>
          
          <div className="rightCol">
            <div className="mapBox">
              <MapContainer />
            </div>
            <div className="predBox">
              <div className="feed">
                <div className="feedObj">
                  <h1>Prediction</h1>
                  <h2>Forecast for {params.disease}</h2>
                </div>
                <div className="feedObj">
                  <h4>{params.country} in the next 5 days</h4>
                  <p>NaN new cases</p>
                  <p>NaN more deaths</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
export default Search;