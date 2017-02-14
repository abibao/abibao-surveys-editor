// react
import React from 'react'
import Reflux from 'reflux'
import {Container, Row, Col} from 'react-grid-system'

// material-ui
import {grey300} from 'material-ui/styles/colors'

// components
import AppBarAbibao from './components/AppBarAbibao'

// stores
import CampaignStore from './../../stores/CampaignStore'

// styles
const StylesAdminEditor = {
  container: {
    height: '100%',
    overflow: 'hidden'
  },
  grid: {
    container: {
      padding: '1rem',
      margin: '0',
      marginTop: 64,
      background: grey300,
      overflow: 'hidden',
      height: '100%'
    },
    row: {
      padding: '0',
      margin: '0',
      height: '100%',
      overflow: 'hidden'
    },
    col: {
      padding: '0.5rem',
      paddingBottom: '0',
      paddingTop: '0',
      margin: '0',
      width: 'auto',
      height: 'auto',
      overflow: 'hidden'
    }
  }
}

const IFrameComponent = React.createClass({
  render: function () {
    let Iframe = this.props.iframe
    return (
      <Row style={StylesAdminEditor.grid.row}>
        <Col xs={12} style={StylesAdminEditor.grid.row}>
          <h2>Campagne : {this.props.campaign.name}</h2>
          <Iframe src={this.props.src} style={{width: '100%', height: 'calc(100% - 135px)', padding: '0', border: '0'}} />
        </Col>
      </Row>
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
    this.stores = [CampaignStore]
    this.handleLoadData = (id) => {
      let store = this.stores[0]
      store.service.get(id).then((campaign) => {
        this.setState({selectedCampaign: campaign})
      }).catch(console.error)
      return store.service.get(id)
    }
    this.handleSaveData = (data) => {
      let store = this.stores[0]
      let campaign = this.state.selectedCampaign
      campaign.data = JSON.parse(data)
      store.service.update(this.state.selectedCampaign.id, campaign)
    }
    window.handleLoadData = this.handleLoadData
    window.handleSaveData = this.handleSaveData
  }
  render () {
    let renderer = () => (
      <div style={StylesAdminEditor.container}>
        <Container fluid style={StylesAdminEditor.grid.container}>
          <AppBarAbibao />
          <IFrameComponent iframe="iframe" campaign={this.state.selectedCampaign} src={'/editor.html?' + this.props.params.id} />
        </Container>
      </div>
    )
    return renderer()
  }
}

export default Editor
