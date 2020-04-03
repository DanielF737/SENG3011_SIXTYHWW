import React from 'react'
import styles from '../styles/feed.module.css'

const mattsToken = "AOYyHmVa91VOLs5ktY5LV1TUowA2"
const mattsURL = 'https://sympt-server.herokuapp.com'

const mipsToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhbmllbEBmZXJyYS5ybyIsInZlcmlmeSI6ImhleWhleWhleSIsImV4cCI6MTU4NTkwODgxM30.cWJW3gjsDtxJaGiVC4FIBwurNr0ejYTCuhzK1nrfOyg"
const mipsURL = "https://audbotb4h3.execute-api.ap-southeast-2.amazonaws.com/dev"

const apiURL = 'http://api.sixtyhww.com:3000'

class Feed extends React.Component {
  constructor () {
    super();
    this.state = {
      results: []
    };
  }

  componentDidMount() {
    let options = {
      method: "GET",
      headers: {
          'Content-Type' : 'application/JSON'
      }
    }
    
    fetch(`${apiURL}/articles?N=20`, options)
    .then(r=> r.json())
    .then(r => {
        console.log(r)
        this.setState({
          results:this.state.results.concat(r)
        })
    })

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
        console.log(r.content.results)
        this.setState({
          results:this.state.results.concat(r.content.results)
        })
    })
  }

  render () {
    let {results} = this.state;
    console.log({results})
    return (
      <div className={styles.feed}>
        {results.map((obj, i) => {
          return (
            <div className={styles.feedObj} key={i}>
              <h4>{obj.headline} - ID:obj.id}</h4>
              <p><a href={obj.url}>View the original source</a></p>
              <p>{obj.date_of_publication} - {obj.reports[0].locations}</p>
              <p>{obj.reports[0].diseases}</p>
              <p>{obj.main_text}</p>
              <br></br>
            </div>
          );
        })}
      </div>
    )
  }
}



export default Feed;