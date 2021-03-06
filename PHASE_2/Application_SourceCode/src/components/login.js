import React from 'react'
import '../styles/login.css'
import dp from '../data/default2.png'
import 'keys'



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
    //console.log(event.target.name)
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
      //console.log(options)

      //console.log(`${apiURL}/${event.target.name}`)
      fetch(`${apiURL}/${event.target.name}`, options)
      .then(r=> r.text())
      .then(r => {
        //console.log(r)
        if (r==='{"errno":19,"code":"SQLITE_CONSTRAINT"}') {
          this.setState({
            error: "An account with this username already exists"
          })
        } else if (r==='Incorrect password') {
          this.setState({
            error: r
          })
        } else if (r==='Invalid username') {
          this.setState({
            error: r
          })
        } else if (r==='') {
          fetch(`${apiURL}/login`, options)
          .then(r=> r.text())
          .then(r => {
            localStorage.setItem('token', r)
            this.props.history.push(`/`);
          })
        } else {
          localStorage.setItem('token', r)
          this.props.history.push(`/`);
        }
        
      })
    }
  }

  render() {
    let token = localStorage.getItem('token')
    let isLoggedIn=false
    if (token != null) {
      isLoggedIn=true

      let options = {
        method: "POST",
        headers: {
            'Content-Type' : 'application/JSON'
        }
      }

      fetch(`${apiURL}/logout`, options)
      .then(r=> r.text())
      .then(r => {
        //console.log(r)
        localStorage.removeItem('token')  
        this.props.history.push(`/`);      
      })
    }


    return (
      <div className="pageBody">
        <div className="login">
          <form >
            <h2>Login or Sign Up</h2>
            <img className="loginImage" src={dp}></img>
            <p className='errorText'><strong>{this.state.error}</strong></p>
            <input className="loginTextBox" type="text" name="email" onChange={this.handleChangeUname} placeholder="email" />
            <br></br>
            <input className="loginTextBox" type="password" name = "password" onChange={this.handleChangePword} placeholder="password" />
            <br></br>
            <button className="loginBtn" type='button' name="login" onClick={this.handleSubmit}>Login</button>
            <button className="signupBtn" type='button' name="register" onClick={this.handleSubmit}>Sign Up</button>
          </form>
        </div>
      </div>
    )
  }
}
export default Login;