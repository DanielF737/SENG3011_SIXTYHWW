import React from 'react';
import {
  Link
} from "react-router-dom";
import "../styles/navbar.css"

class Navbar extends React.Component {
  render () {
    return (
      <div className="Navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/article">article</Link>
          </li>
          <li>
            <Link to="/disease">disease</Link>
          </li>
          <li>
            <Link to="/location">location</Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default Navbar;