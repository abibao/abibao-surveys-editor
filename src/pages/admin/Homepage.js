// react
import React from 'react'
import Reflux from 'reflux'

class Homepage extends Reflux.Component {
  componentDidMount () {
    console.log('Homepage', 'componentDidMount')
  }
  componentWillUnmount () {
    console.log('Homepage', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('Homepage', 'componentDidUpdate')
  }
  constructor (props) {
    console.log('Homepage', 'constructor')
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
