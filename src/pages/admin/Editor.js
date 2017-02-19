// react
import React from 'react'
import Reflux from 'reflux'
import {Container, Row, Col} from 'react-grid-system'
import {findIndex} from 'lodash'

// material-ui
import {grey300} from 'material-ui/styles/colors'

// components
import Feathers from '../../libs/Feathers'
import AppBarAbibao from './components/AppBarAbibao'

// action
import CampaignsStore from './../../stores/CampaignsStore'
import CampaignsActions from './../../actions/CampaignsActions'

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
    console.log('Editor', 'componentDidMount')
    CampaignsActions.initialize()
  }
  componentWillUnmount () {
    console.log('Editor', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('Editor', 'componentDidUpdate')
  }
  constructor (props) {
    console.log('Editor', 'constructor')
    super(props)
    this.state = {
      currentCampaign: {
        name: 'En cours de chargement...'
      }
    }
    this.store = CampaignsStore
    this.handleLoadData = (id) => {
      let i = findIndex(this.state.campaigns, function (o) { return o.id === id })
      this.setState({currentCampaign: this.state.campaigns[i]})
      return Feathers.service('api/campaigns').get(id)
    }
    this.handleSaveData = (data) => {
      this.state.currentCampaign.data = JSON.parse(data)
      CampaignsActions.save(this.state.currentCampaign)
    }
    window.handleLoadData = this.handleLoadData
    window.handleSaveData = this.handleSaveData
  }
  render () {
    let loader = () => (
      <div style={StylesAdminEditor.container}>
        <Container fluid style={StylesAdminEditor.grid.container}>
          <AppBarAbibao />
          <Row style={StylesAdminEditor.grid.row}>
            <Col xs={12} style={StylesAdminEditor.grid.row}>
              <h2>Campagne : {this.state.currentCampaign.name}</h2>
            </Col>
          </Row>
        </Container>
      </div>
    )
    let renderer = () => (
      <div style={StylesAdminEditor.container}>
        <Container fluid style={StylesAdminEditor.grid.container}>
          <AppBarAbibao />
          <IFrameComponent iframe="iframe" campaign={this.state.currentCampaign} src={'/editor.html?' + this.props.params.id} />
        </Container>
      </div>
    )
    if (this.state.campaigns.length === 0) {
      return loader()
    } else {
      return renderer()
    }
  }
}

export default Editor
