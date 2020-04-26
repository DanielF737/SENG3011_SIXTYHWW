import React from 'react'
import '../styles/login.css'
const apiURL = 'http://api.sixtyhww.com:3000'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uname: "",
      pword: "",
      error: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeUname = this.handleChangeUname.bind(this);
    this.handleChangePword = this.handleChangePword.bind(this);
  }

  handleChangeUname = (event) => {
    this.setState({uname: event.target.value})
  }

  handleChangePword = (event) => {
    this.setState({pword: event.target.value});
  }

  handleSubmit = (event) => {
    console.log(event.target.name)
    if (this.state.uname.length === 0 || this.state.pword.length === 0) {
      this.setState({
        error: "Please fill out all fields"
      })
    } else {
      this.setState({
        error: ""
      })

      let reqBody = {
        "username": this.state.uname,
        "password": this.state.pword
      }

      let options = {
        method: "POST",
        headers: {
            'Content-Type' : 'application/JSON'
        },

        body: JSON.stringify(reqBody)
      }
      console.log(options)

      console.log(`${apiURL}/${event.target.name}`)
      fetch(`${apiURL}/${event.target.name}`, options)
      .then(r=> r.text())
      .then(r => {
        console.log(r)
      })
    }
  }

  render() {
    let token = localStorage.getItem('token') 
    return (
      <div className="pageBody">
        <div className="login">
          <form >
            <h2>Login or Sign Up</h2>
            <p className="errorText">{this.state.error}</p>
            <input type="text" name="email" onChange={this.handleChangeUname} placeholder="email" />
            <br></br>
            <input type="password" name = "password" onChange={this.handleChangePword} placeholder="password" />
            <br></br>
            <button type='button' name="login" onClick={this.handleSubmit}>Login</button>
            <button type='button' name="register" onClick={this.handleSubmit}>Sign Up</button>
          </form>
        </div>
      </div>
    )
  }
}
export default Login;