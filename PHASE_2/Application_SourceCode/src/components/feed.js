import React from 'react';
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
      <div className="feed">
        {results.map((obj, i) => {
          return (
            <div key={i}>
              <h4>{obj.headline} - ID:{obj.id}</h4>
              <p>{obj.url}</p>
              <p>{obj.date_of_publication} - {obj.reports[0].location[0].city},{obj.reports[0].location[0].country}</p>
              <p>{obj.reports[0].disease}</p>
              <p>{obj.main_text}</p>
              <break></break>
            </div>
          );
        })}
      </div>
    )
  }
}



export default Feed;