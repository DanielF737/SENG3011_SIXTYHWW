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

  }

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
          onClick={() => console.log("You clicked me!")} />
        })}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBmt_0FRwk3-I3ohh4gK5PfUToBqL58d8I'
})(MapContainer);