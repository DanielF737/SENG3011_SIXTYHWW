import React from 'react'
import '../styles/feed.css'

//const mattsToken = "AOYyHmVa91VOLs5ktY5LV1TUowA2"
//const mattsURL = 'https://sympt-server.herokuapp.com'

const mipsURL = "https://audbotb4h3.execute-api.ap-southeast-2.amazonaws.com/dev"
const apiURL = 'http://api.sixtyhww.com:3000'

class Feed extends React.Component {
  constructor () {
    super()
    this.state = {
      results: []
    }
  }

  componentDidMount() {
    let options = {
      method: "GET",
      headers: {
          'Content-Type' : 'application/JSON'
      }
    }
    
    fetch(`${apiURL}/articles?start=0&end=20`, options)
    .then(r=> r.json())
    .then(r => {
        this.setState({
          results:this.state.results.concat(r)
        })
    })

    options = {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        'email' : 'daniel@ferra.ro',
        'password' : 'P@ssw0rd'
      })
    }

    fetch(`${mipsURL}/user/login`, options)
    .then (r => r.json())
    .then (r => {
      let mipsToken = r.content.token 
      
      options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            'token' : mipsToken
        }
      }
  
      fetch(`${mipsURL}/report?size=10`, options)
      .then(r=> r.json())
      .then(r => {
          this.setState({
            results:this.state.results.concat(r.content.results)
          })
      })
    })
  }

  render () {
    let {results} = this.state
    return (
      <div className="feed">
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
    )
  }
}



export default Feed