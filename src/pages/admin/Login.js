/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import {browserHistory} from 'react-router'

// semantic
import { Container, Button, Segment, Header, Icon, Loader } from 'semantic-ui-react'

import AdminStore from './libs/Store'
// import AdminActions from './libs/Actions'

import Debug from 'debug'
const debug = Debug('abibao-platform:admin')

class Login extends Reflux.Component {
  componentDidMount () {
    debug('Login', 'componentDidMount')
  }
  componentWillUnmount () {
    debug('Login', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    debug('Login', 'constructor')
    super(props)
    this.state = {
      email: 'administrator@abibao.com',
      password: ''
    }
    this.store = AdminStore
    this.handleSubmit = () => {
      debug('Login', 'handleSubmit')
      browserHistory.push('/auth/google')
      // AdminActions.networkAuthenticate({strategy: 'local', email: this.state.email, password: this.state.password})
    }
  }
  render () {
    debug('Login', 'render')
    /*
    <Segment loading={this.state.loader.visible} className="login">
      <Header as="h4" textAlign="left">Votre Email</Header>
      <Input fluid size="large" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} placeholder="Saisissez votre email" className="login" />
      <Header as="h4" textAlign="left">Votre mot de passe</Header>
      <Input fluid size="large" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="Saisissez votre mot de passe" type="password" className="login" />
      <br />
      <Button onClick={this.handleSubmit} size="large" className="login" color="red">Login</Button>
    </Segment>
    */
    let loader = () => {
      return (
        <Container fluid className="loader-reader">
          <Loader active size="huge">{this.state.loader.message}</Loader>
        </Container>
      )
    }
    let renderer = () => (
      <Container fluid className="login">
        <Header as="h2" color="red" icon className="header-login">
          <Icon name="unlock alternate" size="large" />
          ABIBAO
          <Header.Subheader>PLATFORM</Header.Subheader>
        </Header>
        <Segment basic loading={this.state.loader.visible} className="content-login">
          <Button onClick={this.handleSubmit} size="huge" color="google plus">
            <Icon name="google plus" /> Google Plus
          </Button>
        </Segment>
        <Header as="h4" color="red" className="footer-login">
          Plateforme de gestion de sondages
          <Header.Subheader>© 2015-2017 Abibao Inc.</Header.Subheader>
        </Header>
      </Container>
    )
    if (this.state.loader.visible === true) {
      return loader()
    }
    return renderer()
  }
}

export default Login
