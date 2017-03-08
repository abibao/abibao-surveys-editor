/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Container } from 'semantic-ui-react'

class Reader extends Reflux.Component {
  componentDidMount () {
    console.log('Reader', 'componentDidMount')
  }
  componentWillUnmount () {
    console.log('Reader', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    console.log('Reader', 'constructor')
    super(props)
  }
  render () {
    let renderer = () => (
      <Container fluid>
        <h2>READER</h2>
      </Container>
    )
    return renderer()
  }
}

export default Reader
