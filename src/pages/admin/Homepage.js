// react
import React from 'react'
import Reflux from 'reflux'

class Homepage extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    let renderer = () => (
      <div style={{height: '100%'}}>
        {this.props.children}
      </div>
    )
    return renderer()
  }
}

export default Homepage
