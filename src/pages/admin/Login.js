/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import cookie from 'react-cookies'

// semantic
import { Container, Segment, Header, Button, Icon, Loader } from 'semantic-ui-react'

import Config from './libs/Config'
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
    this.state = {
      working: false
    }
    this.store = AdminStore
    if (this.props.location && this.props.location.query.accessToken) {
      this.setState({loader: {visible: true, message: 'Controle en cours...'}})
      let accessToken = this.props.location.query.accessToken
      cookie.save('rememberMe', accessToken, { path: '/' })
    }
    this.handleGoogleLogin = () => {
      this.setState({working: true})
      window.location = Config.auth.google
    }
  }
  render () {
    debug('Login', 'render')
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
        <Segment basic className="content-login">
          <Button loading={this.state.working} onClick={this.handleGoogleLogin} color="google plus" size="huge">
            <Icon name="google" /> Connexion
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
