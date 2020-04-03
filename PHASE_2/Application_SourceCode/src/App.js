import React from 'react';
import './styles/App.css';
import Feed from './components/feed';
import MapContainer from './components/map'
//import { render } from '@testing-library/react';

function App() {
  return (
    <div className="pageBody">
      <Feed />
      <div className="mapBox">
        <MapContainer />
      </div>
    </div>
  )
}



export default App;
