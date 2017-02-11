import React from 'react'
import Reflux from 'reflux'

import {grey300} from 'material-ui/styles/colors'
import {Container, Row, Col} from 'react-grid-system'

import AppBarAbibao from './../components/AppBarAbibao'

const styles = {
  container: {
    background: grey300,
    width: '100%',
    height: '100%'
  },
  box: {
    background: grey300,
    width: '100%'
  },
  grid: {
    container: {
      padding: '0',
      margin: '0',
      marginTop: 64,
      background: grey300
    },
    row: {
      padding: '0',
      margin: '0'
    },
    col: {
      padding: '0',
      margin: '0'
    }
  }
}

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
    // components
    let renderer = () => (
      <div style={styles.container}>
        <div style={styles.box}>
          <AppBarAbibao />
          <Container fluid style={styles.grid.container}>
            <Row>
              <Col>
                <h2>Homepage</h2>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    )
    // renderer
    return renderer()
  }
}

export default Homepage
