import React from 'react'
import Reflux from 'reflux'

import Paper from 'material-ui/Paper'
import {white} from 'material-ui/styles/colors'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import AppStore from './../stores/AppStore'

class Login extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: 'administrator@abibao.com',
      password: ''
    }
    this.stores = [AppStore]
    this.handleSubmit = () => {
      const store = this.stores[0]
      store.login(this.state)
    }
  }

  render () {
    // style
    const style = {
      left: {
        textAlign: 'left'
      },
      papers: {
        content: {
          margin: 'auto',
          marginTop: '40vh',
          transform: 'translateY(-50%)',
          background: white,
          width: '350px',
          padding: '20px',
          textAlign: 'center'
        }
      },
      buttons: {
        login: {
          margin: 'auto',
          marginTop: '20px'
        }
      }
    }
    // renderer
    const renderer = () => (
      <Paper style={style.papers.content}>
        <h2 style={style.left}>Login</h2>
        <TextField type="email" fullWidth hintText="Email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} /><br />
        <TextField type="password" fullWidth hintText="Password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} /><br />
        <RaisedButton label="Login" secondary onTouchTap={this.handleSubmit} style={style.buttons.login} />
      </Paper>
    )
    return renderer()
  }
}

export default Login
