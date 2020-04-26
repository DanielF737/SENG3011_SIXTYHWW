import React from 'react'
import {Link} from 'react-router-dom';
import '../styles/feed.css'
import '../styles/App.css';
import MapContainer from './map'

const mattsToken = "AOYyHmVa91VOLs5ktY5LV1TUowA2"
const mattsURL = 'https://sympt-server.herokuapp.com'

const apiURL = 'http://api.sixtyhww.com:3000'
const mipsURL = "https://audbotb4h3.execute-api.ap-southeast-2.amazonaws.com/dev"
const predURL = 'http://api.sixtyhww.com:3001'

class Search extends React.Component {
  constructor () {
    super();
    this.state = {
      pred: [null],
      results: [],
      markers: [],
      following:[false,false]
    };
    this.handleFollow = this.handleFollow.bind(this);
  }


  componentDidMount() {
    const { params } = this.props.match

    if (params.disease !== "All" && params.country !== "All") {
      let reqBody = {
        "country": params.country,
        "disease": params.disease,
        "days": "5"
      }
      console.log(reqBody)
      
      let options = {
        method: "POST",
        headers: {
            'Content-Type' : 'application/JSON'
        },
        body:JSON.stringify(reqBody)
      };  
      console.log(options)
      
      fetch(`${predURL}/predict`, options)
      .then(r => r.json())
      .then(r => {
        console.log(r)
        if(r.hasOwnProperty("success")) {
          if(params.country=="United States" && params.disease=="COVID-19") {
            r.cases.prediction[1]=r.cases.prediction[1]/10
            r.deaths.prediction[1]=r.deaths.prediction[1]/10
          }
          this.setState({
            pred: [r]
          })
        } else {
          this.setState({
            pred: [-1]
          })
        }
      });
    }
    
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
              report.reports[0].locations[0] = {
                country: report.reports[0].locations[0],
                latitude: res.results[0].geometry.location.lat,
                longitude: res.results[0].geometry.location.lng,
                disease : disease,
                report : report
              }
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
    options = {
      method: "GET",
      headers: {
        'authorization': mattsToken
      },
    }

    fetch(`${mattsURL}/articles/?startdate=2019-06-02T00%3A00%3A00&enddate=2020-04-28T00%3A00%3A00&location=${params.country.replace(' ', '%20')}&keyterms=${params.disease}&count=10`, options)
    .then(r=>r.json())
    .then(r=> {
      for (var i = 0; i < r.articles.length; i++) {
        r.articles[i].source="ProMed"
        r.articles[i].id=i
        r.articles[i].date_of_publication = r.articles[i].date_of_publication.replace('T', ' ')
        r.articles[i].date_of_publication = r.articles[i].date_of_publication.replace('Z', '')
        let disease = r.articles[i].reports[0].diseases[0]
        let report = r.articles[i]
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${r.articles[i].reports[0].locations[0]}&key=AIzaSyBmt_0FRwk3-I3ohh4gK5PfUToBqL58d8I`)
        .then(res=>res.json())
        .then(res => {
          if (res.status != "ZERO_RESULTS") {
            report.reports[0].locations[0].latitude= res.results[0].geometry.location.lat
            report.reports[0].locations[0].longitude= res.results[0].geometry.location.lng
            report.reports[0].locations[0].disease= disease
            report.reports[0].locations[0].report= report
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
        results:this.state.results.concat(r.articles)
      })
    })
  }

  handleFollow(item) {
    let token = localStorage.getItem('token')
    let req=null
    let reqbody=null
    let f1 = this.state.following[0]
    let f2 = this.state.following[1]
    if (item.type==="country") {
      this.setState({
        following: [f1, !f2]
      })
      req="location"
      reqbody= {
        location: item.name
      }
    } else {
      this.setState({
        following: [!f1, f2]
      })
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
    if (params.disease != "All" && isLoggedIn) {
      console.log(params.disease)
      terms.push({name: params.disease,
                  type: "disease"})
    }
    if (params.country != "All" && isLoggedIn) {
      terms.push({name: params.country,
                  type: "country"})
    }

    //console.log(terms)

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
            <div className="feedTitle">
              <h2>  Results for {params.disease} in {params.country}</h2>
                  
              {terms.map((yeet,i) => {
                return(
                <button onClick={() => this.handleFollow(yeet)}>{this.state.following[i] ? 'Following' : 'Follow'} {yeet.name}</button>
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
              {this.state.pred.map((obj,i) => {
                if(obj==null) {
                  return (<div></div>)
                } else if (obj==-1) {
                  return (
                    <div className="feed">
                      <div className="feedObj">
                        <h1>Predictions</h1>
                        <div>
                          <h4>Forecast for {params.disease} in {params.country} over the next 5 days</h4>
                          <p>Insufficient data for a prediction</p>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div className="feed">
                      <div className="feedObj">
                        <h1>Predictions</h1>
                        <div>
                          <h4>Forecast for {params.disease} in {params.country} over the next 5 days</h4>
                          <p>{obj.cases.hasOwnProperty("prediction") ? Math.round(obj.cases.prediction[1]): "Insufficient data to calculate how many more"} new cases</p>
                          <p>{obj.deaths.hasOwnProperty("prediction") ? Math.round(obj.deaths.prediction[1]): "Insufficient data to calculate how many more"} more deaths</p>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </div>
      )
    }
  }
}
export default Search;
