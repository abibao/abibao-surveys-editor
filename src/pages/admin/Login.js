/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import GoogleLogin from 'react-google-login'

// semantic
import { Container, Segment, Header, Icon } from 'semantic-ui-react'

import AdminStore from './libs/Store'
import AdminActions from './libs/Actions'

import Debug from 'debug'
const debug = Debug('abibao-platform:admin')

class Login extends Reflux.Component {
  componentDidMount () {
    debug('Login', 'componentDidMount')
    console.log(this.props)
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
    this.onSuccessGoogle = (response) => {
      debug('onSuccessGoogle', response)
      AdminActions.networkAuthenticate({strategy: 'google', accessToken: response.accessToken})
    }
    this.onFailureGoogle = (error) => {
      console.log('onFailureGoogle', error)
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
          <GoogleLogin
            clientId="10370308640-lfult5ck78v8pu6jknjevp0mqv61tt2e.apps.googleusercontent.com"
            uxMode="popup"
            onSuccess={this.onSuccessGoogle}
            onFailure={this.onFailureGoogle} />
        </Segment>
        <Header as="h4" color="red" className="footer-login">
          Plateforme de gestion de sondages
          <Header.Subheader>© 2015-2017 Abibao Inc.</Header.Subheader>
        </Header>
      </Container>
    )
    return renderer()
  }
}

export default Login
