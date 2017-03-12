/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// store
import AdminStore from './../stores/AdminStore'

class SemanticAdmin extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.store = AdminStore
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

export default SemanticAdmin
