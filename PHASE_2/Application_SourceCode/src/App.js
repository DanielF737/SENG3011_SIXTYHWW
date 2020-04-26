import React, {Component} from 'react';
import './styles/App.css';
import Feed from './components/feed';
import MapContainer from './components/map'
import Prediction from './components/prediction'


const mipsURL = "https://audbotb4h3.execute-api.ap-southeast-2.amazonaws.com/dev"
const apiURL = 'http://api.sixtyhww.com:3000'
//const mattsToken = "AOYyHmVa91VOLs5ktY5LV1TUowA2"
//const mattsURL = 'https://sympt-server.herokuapp.com'


export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      markers: []
    }
  }

  
  // calls the login method in authentication service
  login = () => {
    this.props.auth.login();
  }
  // calls the logout method in authentication service
  logout = () => {
    this.props.auth.logout();
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
        let marks = r.map(obj => obj.reports[0].locations[0])
        for (var i = 0; i < r.length; i++) {
          r[i].source="Global Incident Tracker"
        }
        this.setState({
          results:this.state.results.concat(r),
          markers:this.state.markers.concat(marks)
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
      console.log(mipsToken)
      options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            'token' : mipsToken
        }
      }
  
      fetch(`${mipsURL}/report?start_date=2020-01-01T00%3A00%3A00.000Z&end_date=2030-01-01T00%3A00%3A00.000Z&size=10`, options)
      .then(r=> r.json())
      .then(r => {
        for (var i = 0; i < r.content.results.length; i++) {
          r.content.results[i].source="CDC"
          r.content.results[i].id=i
          //https://maps.googleapis.com/maps/api/geocode/json?address=sydney,+Australia&key=AIzaSyBmt_0FRwk3-I3ohh4gK5PfUToBqL58d8I
        }
        console.log(r)
        this.setState({
          results:this.state.results.concat(r.content.results)
        })
      })
    })
  }

  render() {
    return (
      <div className="pageBody">
        <Feed results={this.state.results}/>
        <div className="rightCol">
          <div className="mapBox">
            <MapContainer markers={this.state.markers}/>
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
