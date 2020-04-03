import React from 'react';
import {
  Link
} from "react-router-dom";
import "../styles/navbar.css"
import Autocomplete from "./autocomplete"

class Navbar extends React.Component {
  render () {
    return (
      <div className="Navbar">
        <ul>
          <li className="logo">
            <Link to="/">SIXTYHWW</Link>
          </li>
          <li>
            <Autocomplete
              suggestions={[
                "Alligator",
                "Bask",
                "Crocodilian",
                "Death Roll",
                "Eggs",
                "Jaws",
                "Reptile",
                "Solitary",
                "Tail",
                "Wetlands"
              ]}
            />
          </li>
        </ul>
      </div>
    )
  }
}

export default Navbar;