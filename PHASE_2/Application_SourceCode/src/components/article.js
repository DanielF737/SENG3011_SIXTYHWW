import React from 'react'
import MapContainer from './map'

import '../styles/feed.css'
import '../styles/App.css';

const apiURL = 'http://api.sixtyhww.com:3000'

class Article extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      results:[]
    }
  }

  componentDidMount() {
    const { params } = this.props.match

    let options = {
    method: "GET",
    headers: {
        'Content-Type' : 'application/JSON'
    }
  }
  
  fetch(`${apiURL}/articles/${params.id}`, options)
  .then(r=> r.json())
  .then(r => {
    console.log(r)
    this.setState({
      results:this.state.results.concat(r)
    })
  })

  }
  
  render() {
    const { params } = this.props.match
    return (
      <div className="pageBody">
        <div className="feed">
            {this.state.results.map((obj, i) => {
              return(
                <div className="feedObj">
                  <h4>{obj.headline}</h4>
                  <p><a href={obj.url}>View the original source</a></p>
                  <p>{obj.date_of_publication}</p>
                  <p>{obj.body}</p>
                </div>
              )
            })}
        </div>
        <div className="rightCol">
          <div className="mapBox">
            <MapContainer />
          </div>
        </div>
      </div>
    )
  }
}
export default Article;