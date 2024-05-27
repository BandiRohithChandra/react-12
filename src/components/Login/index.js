// Write your JS code here

import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {loginFailed: false, error: '', username: '', password: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
    console.log('login success')
  }

  onSubmitFailure = error => {
    this.setState({loginFailed: true, error})
    console.log('login failure')
  }

  submitButton = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userCreds = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userCreds),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {loginFailed, error, username, password} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <form className="login-container" onSubmit={this.submitButton}>
        <h1>Please Login</h1>
        <label htmlFor="username" className="label">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          onChange={this.onChangeUsername}
          className="input"
          value={username}
        />

        <label htmlFor="password" className="label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          onChange={this.onChangePassword}
          className="input"
          value={password}
        />

        <button type="submit">Login with sample creds</button>
        {loginFailed && <p className="error-message">{error}</p>}
      </form>
    )
  }
}

export default Login
