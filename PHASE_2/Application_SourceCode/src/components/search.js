import React from 'react'
import {Link} from 'react-router-dom';
import '../styles/feed.css'
import '../styles/App.css';
import MapContainer from './map'

//const mattsToken = "AOYyHmVa91VOLs5ktY5LV1TUowA2"
//const mattsURL = 'https://sympt-server.herokuapp.com'

const apiURL = 'http://api.sixtyhww.com:3000'
const mipsURL = "https://audbotb4h3.execute-api.ap-southeast-2.amazonaws.com/dev"

class Search extends React.Component {
  constructor () {
    super();
    this.state = {
      results: [],
      markers: []
    };
    this.handleFollow = this.handleFollow.bind(this);
  }


  componentDidMount() {
    const { params } = this.props.match
    
    let currentDate = new Date();
    let d = currentDate.getDate();
    let m = currentDate.getMonth() + 1;
    let y = currentDate.getFullYear();
    let h = currentDate.getHours();
    let min = currentDate.getMinutes();
    let s = currentDate.getSeconds();
    let current = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + 'T' + (h <= 9 ? '0' + h : h) + ':'+ (min <= 9 ? '0' + min : min) + ':'+ (s <= 9 ? '0' + s : s)
    
    let startDate = new Date("1 January 2000 00:00 UTC");
    d = startDate.getDate();
    m = startDate.getMonth() + 1;
    y = startDate.getFullYear();
    h = startDate.getHours();
    min = startDate.getMinutes();
    s = startDate.getSeconds();
    let start = y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + 'T' + (h <= 9 ? '0' + h : h) + ':'+ (min <= 9 ? '0' + min : min) + ':'+ (s <= 9 ? '0' + s : s)

    ////console.log(start + ' ' + current)

    let reqBody = {
      "start_date": start,
      "end_date": current
    }

    if (params.disease !== "All") {
      ////console.log("Not all diseases")
      reqBody["keyTerms"] = params.disease
    }
    if (params.country !== "All") {
      ////console.log("Not all countries")
      reqBody["location"] = params.country
    }

    ////console.log(reqBody)

    let options = {
      method: "POST",
      headers: {
          'Content-Type' : 'application/JSON'
      },
      body: JSON.stringify(reqBody)
    }

    ////console.log(options)
    
    fetch(`${apiURL}/search`, options)
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
      ////console.log(mipsToken)
      options = {
        method: "GET",
        headers: {
            'Content-Type' : 'application/JSON',
            'token' : mipsToken
        }
      }
      
      fetch(`${mipsURL}/report?key_terms=${params.disease}&location=${params.country.replace(' ', '%20')}`, options)
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
        this.setState({
          results:this.state.results.concat(r.content.results)
        })
      })
    })

  }

  handleFollow(item) {
    let token = localStorage.getItem('token')
    let req=null
    let reqbody=null
    if (item.type==="country") {
      req="location"
      reqbody= {
        location: item.name
      }
    } else {
      req="disease_or_syndrome"
      reqbody= {
        disease_or_syndrome: item.name
      }
    }

    

    let options = {
      method: "POST",
      headers: {
          'Content-Type' : 'application/JSON',
          'authorization': token
      },
      body:JSON.stringify(reqbody)
    }
    console.log(reqbody)

    console.log(`${apiURL}/follow_${req}`)
    fetch(`${apiURL}/follow_${req}`, options)
    .then(r=> r.text())
    .then(r => {
      console.log(r)
    })
  }

  render() {
    const { params } = this.props.match

    let {results} = this.state;
    results = results.sort((a, b) => (a.date_of_publication < b.date_of_publication) ? 1 : -1)
    
    
    let token = localStorage.getItem('token')
    let isLoggedIn=false
    if (token != null) {
      isLoggedIn=true
    }
    let terms = []
    if (params.disease != "All") {
      console.log(params.disease)
      terms.push({name: params.disease,
                  type: "disease"})
    }
    if (params.country != "All") {
      terms.push({name: params.country,
                  type: "country"})
    }

    console.log(terms)

    if (results.length === 0) {
      return (
        <div className="pageBody">
        <div className="feedObj">
          <h4>No results for {params.disease} in {params.country}</h4>
        </div></div>
      );
    } else {
      return (
        <div className="pageBody">
          <div className="feed">
            <div className="feedObj">
              <h2>  Results for {params.disease} in {params.country}</h2>
                  
              {terms.map((yeet,i) => {
                return(
                <label><a href='#' onClick={() => this.handleFollow(yeet)}>Follow  {yeet.name}</a>. </label>
                )
              })}
            </div>
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
          
          <div className="rightCol">
            <div className="mapBox">
              <MapContainer markers={this.state.markers}/>
            </div>
            <div className="predBox">
              <div className="feed">
                <div className="feedObj">
                  <h1>Predictions</h1>
                  <h4>Forecast for {params.disease} in {params.country} over the next 5 days</h4>
                  <p>NaN new cases</p>
                  <p>NaN more deaths</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
export default Search;