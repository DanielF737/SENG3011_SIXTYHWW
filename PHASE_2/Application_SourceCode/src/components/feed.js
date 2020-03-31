import React from 'react';
import styles from '../styles/feed.module.css';

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
          results:r
        })
    })
  }

  render () {
    let {results} = this.state;
    console.log({results})
    return (
      <div className={styles.feed}>
        {results.map((obj, i) => {
          console.log("yeet" + {i})
          return (
            <div className={styles.feedObj} key={i}>
              <h4>{obj.headline} - ID:{obj.id}</h4>
              <p><a href={obj.url}>View the original source</a></p>
              <p>{obj.date_of_publication} - {obj.reports[0].location[0].city},{obj.reports[0].location[0].country}</p>
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