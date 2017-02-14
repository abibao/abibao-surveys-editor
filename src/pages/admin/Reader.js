// react
import React from 'react'
import Reflux from 'reflux'
import {Container, Row, Col} from 'react-grid-system'

// components
import SurveyReader from './../../components/readers/mqst'

// stores
import CampaignStore from './../../stores/CampaignStore'

class Reader extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {}
    this.stores = [CampaignStore]
  }
  render () {
    // components
    let renderer = () => (
      <Container fluid className="{readerCSS.grid.container}">
        <Row className="{readerCSS.grid.row}">
          <Col><SurveyReader /></Col>
        </Row>
      </Container>
    )
    // renderer
    return renderer()
  }
}

export default Reader
