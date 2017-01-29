import React from 'react'
import Reflux from 'reflux'

import FeathersStore from './../stores/FeathersStore'

class Login extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [FeathersStore]
  }

  render () {
    // style
    // renderer
    const renderer = () => (
      <h2>Login</h2>
    )
    return renderer()
  }
}

export default Login
