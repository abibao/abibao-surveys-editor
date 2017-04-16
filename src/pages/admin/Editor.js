/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Container, Icon, Header, Segment } from 'semantic-ui-react'

import AdminStore from './../../stores/AdminStore'
import AdminActions from './../../actions/AdminActions'

const IFrameComponent = React.createClass({
  render: function () {
    let Iframe = this.props.iframe
    return (
      <Iframe src={this.props.src} style={{width: '100%', height: '100%', padding: '0', border: '0'}} />
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
      menuOn: false,
      selectedCampaign: false
    }
    this.store = AdminStore
    this.toggleVisibility = () => this.setState({ menuOn: !this.state.menuOn })
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
        <Header as="h1" attached inverted color="red" className="appbar">
          <Icon name="settings" />
          <Header.Content>
            ABIBAO
            <Header.Subheader>
              platform
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Segment basic className="editor">
          <IFrameComponent iframe="iframe" campaign={this.state.selectedCampaign} src={'/editor.html?' + this.props.params.id} />
        </Segment>
      </Container>
    )
    return renderer()
  }
}

export default Editor
