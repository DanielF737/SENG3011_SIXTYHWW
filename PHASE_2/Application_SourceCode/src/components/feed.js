import React from 'react'
import '../styles/feed.css'
import {Link} from 'react-router-dom';


class Feed extends React.Component {

  render () {
    let {results} = this.props
    results = results.sort((a, b) => (a.date_of_publication < b.date_of_publication) ? 1 : -1)
    return (
      <div className="feed">
        {results.map((obj, i) => {
          return (
            <div className="feedObj" key={i}>
              <h2 ><Link className="headerText" to={{
                pathname: `/article/${obj.id}`,
                articleProps: {
                  article:obj,
                  marker:[obj.reports[0].locations[0]]
                }
              }}> {obj.headline}</Link></h2>
              <p className="subText">{obj.date_of_publication} - {obj.source}</p>
            </div>
        )})}
      </div>
    )
  }
}



export default Feed