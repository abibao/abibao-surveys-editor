import React from 'react'
import Reflux from 'reflux'

import {grey300} from 'material-ui/styles/colors'
import {Container, Row, Col} from 'react-grid-system'

import AppBarAbibao from './../components/AppBarAbibao'

import AppStore from './../stores/AppStore'
import CampaignStore from './../stores/CampaignStore'

const styles = {
  container: {
    background: grey300,
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  box: {
    background: grey300,
    width: '100%',
    height: '100%'
  },
  grid: {
    container: {
      padding: '0',
      margin: '0',
      marginTop: 64,
      height: '100%',
      background: grey300
    },
    row: {
      padding: '0',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      height: '100%',
      margin: '0'
    },
    col: {
      padding: '0',
      height: '100%',
      margin: '0'
    }
  }
}

const IFrameComponent = React.createClass({
  render: function () {
    let Iframe = this.props.iframe
    return (
      <Container fluid style={styles.grid.container}>
        <Row style={styles.grid.row}>
          <Col xs={12} style={styles.grid.col}>
            <h2>Campagne : {this.props.campaign.name}</h2>
            <Iframe src={this.props.src} style={{width: '100%', height: 'calc(100% - 150px)', padding: 0, border: 0}} />
          </Col>
        </Row>
      </Container>
    )
  }
})

class Editor extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {
      selectedCampaign: {
        name: 'En cours de chargement...'
      }
    }
    this.stores = [AppStore, CampaignStore]
    this.handleLoadData = (id) => {
      let store = this.stores[1]
      store.service.get(id).then((campaign) => {
        this.setState({selectedCampaign: campaign})
      }).catch(console.error)
      return store.service.get(id)
    }
    this.handleSaveData = (data) => {
      let store = this.stores[1]
      let campaign = this.state.selectedCampaign
      campaign.data = JSON.parse(data)
      store.service.update(this.state.selectedCampaign.id, campaign)
    }
    window.handleLoadData = this.handleLoadData
    window.handleSaveData = this.handleSaveData
  }
  render () {
    // renderer
    let renderer = () => (
      <div style={styles.container}>
        <div style={styles.box}>
          <AppBarAbibao />
          <IFrameComponent iframe="iframe" campaign={this.state.selectedCampaign} src={'/editor.html?' + this.props.params.id} />
        </div>
      </div>
    )
    return renderer()
  }
}

export default Editor
