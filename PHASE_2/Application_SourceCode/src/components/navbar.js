import React from 'react';
import {withRouter, Link} from 'react-router-dom';

import "../styles/navbar.css"


import Diseases from "../data/diseases.json"
import Countries from "../data/countries.json"

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disease: 'COVID-19',
      country: 'Australia',
      isLoggedIn: false
    };

    this.handleChangeDisease = this.handleChangeDisease.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeDisease = (event) => {
    this.setState({disease: event.target.value})
  }

  handleChangeCountry = (event) => {
    this.setState({country: event.target.value});
  }

  handleSubmit = (event) => {
    this.props.history.push(`/search/disease=${this.state.disease}&country=${this.state.country}`);
  }


  render () {
    let token = localStorage.getItem('token')
    let isLoggedIn=false
    if (token != null) {
      isLoggedIn=true
    }

    return (
      <div className="Navbar">
        <nav className="navItems">
          <div className="navItem">
            <Link className="logoText" to="/">SIXTYHWW</Link>
          </div>
          <div className="navItem">
            <form onSubmit={this.handleSubmit}>
              <select className="searchSelect" value={this.state.disease} onChange={this.handleChangeDisease}>
                {Diseases.map((obj, i) => <option key={obj.name}>{obj.name}</option>)}
              </select>
              <select className="searchSelect" value={this.state.country} onChange={this.handleChangeCountry}>
                {Countries.map((obj, i) => <option key={obj.name}>{obj.name}</option>)}
              </select>
              <input className="searchButton" type="submit" value="Search" />
            </form>
          </div>
        </nav>
        <nav className="navItems navItemsRight">
          <div className="navItem">
            <strong><Link className="loginText" to="/login">{isLoggedIn ? 'Log Out' : 'Login'}</Link></strong>
          </div>
        </nav>
      </div>
    )
  }
}

export default withRouter(Navbar);