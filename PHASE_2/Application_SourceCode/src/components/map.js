import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';

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
      selectedMarker: null,
      showingInfoWindow:false,
      infoWindowLat:0,
      infoWindowLong:0,
      infoWindowCity:"",
      infoWindowCountry:"",
      infoWindowDisease:""
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(marker) {
    console.log("You clicked me!")
    console.log(marker)
    this.setState({
      showingInfoWindow:true,
      infoWindowLat:marker.latitude,
      infoWindowLong:marker.longitude,
      infoWindowCity:marker.city,
      infoWindowCountry:marker.country,
      infoWindowDisease:marker.disease
    })
  } 

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ showingInfoWindow:false })
  };

  render() {
    let {markers} = this.props
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
          onClick={() => this.handleClick(store)} />
        })}
        <InfoWindow
          onClose={this.onInfoWindowClose}
          visible={this.state.showingInfoWindow}
          position={{
            lat: this.state.infoWindowLat,
            lng: this.state.infoWindowLong
          }}>
            <h4>{this.state.infoWindowCity} {this.state.infoWindowCountry}</h4>
            <p>{this.state.infoWindowDisease}</p>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBmt_0FRwk3-I3ohh4gK5PfUToBqL58d8I'
})(MapContainer);