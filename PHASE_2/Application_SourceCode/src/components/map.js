import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {withRouter} from 'react-router-dom';

const apiURL = 'http://api.sixtyhww.com:3000'

const mapStyles = {
  padding: '50px',
  width: '700px',
  height: '350px',
  borderRadius: '20px',
  display: 'block'
};


export class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: []
    }
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
      this.setState({
        markers:this.state.markers.concat(marks)
      })
  }) 
  }

  render() {
    let {markers} = this.state
    console.log(this.props)
    return (
      <Map
        google={this.props.google}
        zoom={2}
        style={mapStyles}
        initialCenter={{ lat: 35.676, lng: 139.650}}
      >
        {markers.map((store, index) => {
          return <Marker key={index} id={index} position={{
            lat: store.latitude,
            lng: store.longitude
          }}
          onClick={() => console.log("You clicked me!")} />
        })}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBmt_0FRwk3-I3ohh4gK5PfUToBqL58d8I'
})(MapContainer);