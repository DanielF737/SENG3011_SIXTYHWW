import React, {Component} from 'react';
import './styles/App.css';
import Feed from './components/feed';
import MapContainer from './components/map'
import Prediction from './components/prediction'

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: []
    }
  }

  callbackFunction = (childData) => {
    this.setState({markers: childData})
  }

  render() {
    return (
      <div className="pageBody">
        <Feed results={this.state.results}/>
        <div className="rightCol">
          <div className="mapBox">
            <MapContainer />
          </div>
          <div className="predBox">
            <Prediction />
          </div>
        </div>
      </div>
    ) 
  }
}



export default App;
