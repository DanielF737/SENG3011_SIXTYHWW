import React from 'react'
import '../styles/feed.css'
import {Link} from 'react-router-dom';


class Feed extends React.Component {

  render () {
    let {results} = this.props
    return (
      <div className="feed">
        {results.map((obj, i) => {
          return (
            <div className="feedObj" key={i}>
              <h4><Link to={{
                pathname: `/article/${obj.id}`,
                articleProps: {
                  article:obj,
                  marker:[obj.reports[0].locations[0]]
                }
              }}> {obj.headline}</Link></h4>
              <p>{obj.date_of_publication}</p>
              <p>{obj.source}</p>
              <br></br>
            </div>
        )})}
      </div>
    )
  }
}



export default Feed