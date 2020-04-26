import React from 'react'
import MapContainer from './map'

import '../styles/feed.css'
import '../styles/App.css';


class Article extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      results:[],
      markers:[]
    }
  }
  
  render() {
    //console.log(this.props.location.articleProps)
    let article=this.props.location.articleProps.article
    let marker= this.props.location.articleProps.marker
    //console.log(marker)
    
    return (
      <div className="pageBody">
        <div className="feed">
          
          <div className="feedObj">
            <h4 className="headerText"> {article.headline}</h4>
            <p className="subText">{article.date_of_publication} - {article.source}</p>
            <p>{article.main_text}</p>
            <p><a href={article.url}>View the original article</a></p>
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