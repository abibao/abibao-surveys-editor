/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import cookie from 'react-cookie'

// semantic
import { Container, Segment, Header, Icon } from 'semantic-ui-react'

import AdminStore from './libs/Store'

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
    this.store = AdminStore
    if (this.props.location && this.props.location.query.accessToken) {
      let accessToken = this.props.location.query.accessToken
      cookie.save('rememberMe', accessToken, { path: '/' })
    }
  }
  render () {
    debug('Login', 'render')
    let renderer = () => (
      <Container fluid className="login">
        <Header as="h2" color="red" icon className="header-login">
          <Icon name="unlock alternate" size="large" />
          ABIBAO
          <Header.Subheader>PLATFORM</Header.Subheader>
        </Header>
        <Segment basic className="content-login">
          <a href="http://localhost:3000/auth/google" className="button">Login With Google</a>
        </Segment>
        <Header as="h4" color="red" className="footer-login">
          Plateforme de gestion de sondages
          <Header.Subheader>© 2015-2017 Abibao Inc.</Header.Subheader>
        </Header>
      </Container>
    )
    if (this.props.location && this.props.location.query.accessToken) {
      return (<h2>Controle en cours...</h2>)
    }
    return renderer()
  }
}

export default Login
