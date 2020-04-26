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
    let token = localStorage.getItem('token')
    let isLoggedIn=false
    if (token != null) {

      let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            'authorization': token
        }
      }
      
      fetch(`${apiURL}/feed`, options)
      .then(r=> r.json())
      .then(r => {
        console.log("here")
        console.log(r)
        for (var i = 0; i < r.length; i++) {
          r[i].reports[0].diseases=r[i].reports[0].diseases.replace('"', '')
          r[i].reports[0].diseases=r[i].reports[0].diseases.replace('"', '')
          r[i].reports[0].diseases=r[i].reports[0].diseases.replace('[', '')
          r[i].reports[0].diseases=r[i].reports[0].diseases.replace(']', '')
          r[i].reports[0].locations[0].disease=r[i].reports[0].diseases
          r[i].reports[0].locations[0].report=r[i]
          r[i].source="Global Incident Tracker"
          console.log(r[i])
        }
        let marks = r.map(obj => obj.reports[0].locations[0])
        this.setState({
          results:this.state.results.concat(r),
          markers:this.state.markers.concat(marks)
        })
      })

    } else {

      let options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON'
        }
      }
      
      fetch(`${apiURL}/articles?start=0&end=20`, options)
      .then(r=> r.json())
      .then(r => {

          for (var i = 0; i < r.length; i++) {
            r[i].reports[0].diseases=r[i].reports[0].diseases.replace('"', '')
            r[i].reports[0].diseases=r[i].reports[0].diseases.replace('"', '')
            r[i].reports[0].diseases=r[i].reports[0].diseases.replace('[', '')
            r[i].reports[0].diseases=r[i].reports[0].diseases.replace(']', '')
            r[i].reports[0].locations[0].disease=r[i].reports[0].diseases
            r[i].reports[0].locations[0].report=r[i]
            r[i].source="Global Incident Tracker"
            //console.log(r[i])
          }
          let marks = r.map(obj => obj.reports[0].locations[0])
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
        //console.log(mipsToken)
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
          for (var i = 0; i < r.content.results.length; i++) {
            r.content.results[i].source="CDC"
            r.content.results[i].id=i
            r.content.results[i].date_of_publication = r.content.results[i].date_of_publication.replace('T', ' ')
            r.content.results[i].date_of_publication = r.content.results[i].date_of_publication.replace('Z', '')
            let disease = r.content.results[i].reports[0].diseases[0]
            let report = r.content.results[i]
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${r.content.results[i].reports[0].locations[0]}&key=AIzaSyBmt_0FRwk3-I3ohh4gK5PfUToBqL58d8I`)
            .then(res=>res.json())
            .then(res => {
              ////console.log(res)
              if (res.status != "ZERO_RESULTS") {
                let mark = {
                  latitude: res.results[0].geometry.location.lat,
                  longitude: res.results[0].geometry.location.lng,
                  disease: disease
                }

                if(res.results[0].hasOwnProperty('address_components')){
                  mark.country=res.results[0].address_components[0].long_name
                }else{
                  
                  mark.country=""
                }

                if(res.results[0].hasOwnProperty('address_components') && res.results[0].address_components[1]!=null) {
                  mark.city=res.results[0].address_components[1].long_name
                }else{
                  mark.city=""
                }
                mark.report=report

                this.setState({
                  markers:this.state.markers.concat(mark)
              
                })
                
              }
            })
          }
          //console.log(r)
          this.setState({
            results:this.state.results.concat(r.content.results)
          })
        })
      })
    }
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
