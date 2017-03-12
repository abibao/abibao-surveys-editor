/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// store
import ReaderStore from './../stores/ReaderStore'

class SemanticReader extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.store = ReaderStore
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

export default SemanticReader
