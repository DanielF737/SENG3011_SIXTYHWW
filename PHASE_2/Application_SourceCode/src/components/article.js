import React from 'react'
import MapContainer from './map'

import '../styles/feed.css'
import '../styles/App.css';

const apiURL = 'http://api.sixtyhww.com:3000'

class Article extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      results:[],
      markers:[]
    }
  }
  
  render() {
    console.log(this.props.location.articleProps)
    let article=this.props.location.articleProps.article
    let marker= this.props.location.articleProps.marker
    console.log(marker)
    const { params } = this.props.match
    return (
      <div className="pageBody">
        <div className="feed">
          
          <div className="feedObj">
            <h4> {article.headline}</h4>
            <p><a href={article.url}>View the original source</a></p>
            <p>{article.date_of_publication}</p>
            <p>{article.main_text}</p>
            <br></br>
          </div>

        </div>
        <div className="rightCol">
          <div className="mapBox">
            <MapContainer markers={marker}/>
          </div>
        </div>
      </div>
    )
  }
}
export default Article;