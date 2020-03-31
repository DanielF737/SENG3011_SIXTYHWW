import React from 'react';
import './styles/App.css';
import Feed from './components/feed';
import MapContainer from './components/map'
//import { render } from '@testing-library/react';

function App() {
  return (
    <div>
      <MapContainer />
      <br></br>
      <Feed />
    </div>
  )
}



export default App;
