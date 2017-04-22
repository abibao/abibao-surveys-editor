/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Container, Segment } from 'semantic-ui-react'

// components
import AppBar from './components/AppBar'

import AdminStore from './libs/Store'
import AdminActions from './libs/Actions'

const IFrameComponent = React.createClass({
  render: function () {
    let Iframe = this.props.iframe
    return (
      <Iframe src={this.props.src} style={{marginTop: '77px', width: '100%', height: '100%', padding: '0', border: '0'}} />
    )
  }
})

class Editor extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.selectedCampaign === false && this.state.campaigns[this.props.params.id]) {
      this.setState({selectedCampaign: this.state.campaigns[this.props.params.id]})
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      selectedCampaign: false
    }
    this.store = AdminStore
    this.handleLoadData = (id) => {
      return this.state.client.service('api/campaigns').get(id)
    }
    this.handleSetData = (data) => {
      this.setState({selectedCampaign: data})
    }
    this.handleSaveData = (data) => {
      this.state.selectedCampaign.data = JSON.parse(data)
      AdminActions.campaignUpdate(this.state.selectedCampaign)
    }
    window.handleSetData = this.handleSetData
    window.handleLoadData = this.handleLoadData
    window.handleSaveData = this.handleSaveData
  }
  render () {
    let renderer = () => (
      <Container fluid className="editor">
        <AppBar />
        <Segment basic className="editor">
          <IFrameComponent iframe="iframe" campaign={this.state.selectedCampaign} src={'/editor.html?' + this.props.params.id} />
        </Segment>
      </Container>
    )
    return renderer()
  }
}

export default Editor
