/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Container, Loader } from 'semantic-ui-react'

import AdminStore from './libs/Store'
import AdminActions from './libs/Actions'

import Debug from 'debug'
const debug = Debug('abibao-platform:admin')

class Logout extends Reflux.Component {
  componentDidMount () {
    debug('Logout', 'componentDidMount')
  }
  componentWillUnmount () {
    debug('Logout', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.currentUser !== false) {
      AdminActions.networkLogout()
    }
  }
  constructor (props) {
    debug('Logout', 'constructor')
    super(props)
    this.store = AdminStore
  }
  render () {
    debug('Logout', 'render')
    let renderer = () => {
      return (
        <Container fluid className="loader-reader">
          <Loader active size="huge">{this.state.loader.message}</Loader>
        </Container>
      )
    }
    return renderer()
  }
}

export default Logout
