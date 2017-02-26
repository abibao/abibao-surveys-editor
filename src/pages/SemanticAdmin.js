/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// store
import ApplicationStore from '../stores/ApplicationStore'

class Application extends Reflux.Component {
  componentDidMount () {
    console.log('Application', 'componentDidMount')
  }
  componentWillUnmount () {
    console.log('Application', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    console.log('Application', 'constructor')
    super(props)
    this.state = {}
    this.store = ApplicationStore
  }
  render () {
    let renderer = () => (
      <div>
        {this.props.children}
      </div>
    )
    return renderer()
  }
}

export default Application
