/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Container, Sidebar, Icon, Segment, Menu, Header, Button } from 'semantic-ui-react'

// libraries
import Feathers from './../../libs/Feathers'

// store
import ApplicationStore from './../../stores/ApplicationStore'

// actions
import CampaignActions from './../../actions/CampaignActions'

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
    console.log('Editor', 'componentDidMount')
  }
  componentWillUnmount () {
    console.log('Editor', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.selectedCampaign === false && this.state.campaigns[this.props.params.id]) {
      this.setState({selectedCampaign: this.state.campaigns[this.props.params.id]})
    }
  }
  constructor (props) {
    console.log('Editor', 'constructor')
    super(props)
    this.state = {
      menuOn: false,
      selectedCampaign: false
    }
    this.store = ApplicationStore
    this.toggleVisibility = () => this.setState({ menuOn: !this.state.menuOn })
    this.handleLoadData = (id) => {
      return Feathers.service('api/campaigns').get(id)
    }
    this.handleSetData = (data) => {
      this.setState({selectedCampaign: data})
    }
    this.handleSaveData = (data) => {
      this.state.selectedCampaign.data = JSON.parse(data)
      CampaignActions.campaignUpdate(this.state.selectedCampaign)
    }
    window.handleSetData = this.handleSetData
    window.handleLoadData = this.handleLoadData
    window.handleSaveData = this.handleSaveData
  }
  render () {
    let renderer = () => (
      <Container fluid className="editor">
        <Segment basic>
          <Menu borderless fixed="top" size="large">
            <Menu.Item>
              <Button onClick={this.toggleVisibility} icon="content" color="red" />
            </Menu.Item>
            <Menu.Item>
              <Header as="h1" color="red" className="appbar">
                ABIBAO
                <Header.Subheader>platform</Header.Subheader>
              </Header>
            </Menu.Item>
          </Menu>
        </Segment>
        <Sidebar.Pushable as={Segment} basic className="content">
          <Sidebar as={Menu} animation="push" visible={this.state.menuOn} icon="labeled" vertical inverted color="grey">
            <Menu.Item name="home">
              <Icon name="home" />
              Home
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher className="editor">
            <Segment padded basic loading={this.state.loader.visible} className="editor">
              <Header as="h2" color="red">
                Campagne
                <Header.Subheader>{(this.state.selectedCampaign && this.state.selectedCampaign.name) ? this.state.selectedCampaign.name : 'En cours de chargement...'}</Header.Subheader>
              </Header>
              <IFrameComponent iframe="iframe" campaign={this.state.selectedCampaign} src={'/editor.html?' + this.props.params.id} />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Container>
    )
    return renderer()
  }
}

export default Editor
