/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import Dropzone from 'react-dropzone'
import {browserHistory} from 'react-router'

// semantic
import { Container, Segment, Menu, Icon, Button, Header, Sidebar, Card, Image, Modal } from 'semantic-ui-react'

// store
import ApplicationStore from '../../stores/ApplicationStore'

// actions
import CampaignActions from '../../actions/CampaignActions'

class Campaigns extends Reflux.Component {
  componentDidMount () {
    console.log('Campaigns', 'componentDidMount')
  }
  componentWillUnmount () {
    console.log('Campaigns', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    console.log('Campaigns', 'constructor')
    super(props)
    this.state = {
      menuOn: false,
      selectedCampaign: false
    }
    this.store = ApplicationStore
    this.toggleVisibility = () => this.setState({ menuOn: !this.state.menuOn })
    this.handleChangePicture = (files) => {
      CampaignActions.campaignUpdatePicture(this.state.selectedCampaign.id, files[0])
    }
    this.handleOpenEditor = (key) => {
      console.log('Campaigns', 'handleOpenEditor', key)
      browserHistory.push('/admin/editor/' + key)
    }
    this.handleOpenReader = (key) => {
      console.log('Campaigns', 'handleOpenReader', key)
      browserHistory.push('/admin/reader/' + key)
    }
    this.handleOpenDropzone = (key) => {
      console.log('Campaigns', 'handleOpenDropzone', key)
      this.setState({selectedCampaign: this.state.campaigns[key]})
      this.refs.dropzone.open()
    }
    this.handleCampaignCreate = () => {
      CampaignActions.campaignCreate()
    }
  }
  render () {
    let renderer = () => (
      <Container fluid>
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
          <Sidebar.Pusher>
            <Segment padded basic loading={this.state.loader.visible}>
              <Header as="h2" color="red">
                Listes des campagnes
                <Header.Subheader>Il y a actuellement {Object.keys(this.state.campaigns).length || 0} campagnes en lignes.</Header.Subheader>
              </Header>
              <Dropzone style={{display: 'none'}} ref="dropzone" multiple={false} onDrop={this.handleChangePicture} />
              <Card.Group>
                {Object.keys(this.state.campaigns).map((key) => (
                  <Card key={key} centered>
                    <Image height="140" src={process.env.REACT_APP_FEATHERS_URI + '/' + this.state.campaigns[key].picture} />
                    <Card.Content>
                      <Card.Header>
                        {this.state.campaigns[key].name}
                      </Card.Header>
                      <Card.Meta>
                        <span>
                          {this.state.campaigns[key].company.name || 'Aucune'}
                        </span>
                      </Card.Meta>
                      <Card.Description>
                        {this.state.campaigns[key].description}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Modal trigger={<Icon bordered link name="setting" inverted color="grey" />}>
                        <Modal.Header>Select a Photo</Modal.Header>
                        <Modal.Content image>
                          <Image wrapped size="medium" src="http://semantic-ui.com/images/avatar2/large/rachel.png" />
                          <Modal.Description>
                            <Header>AAA</Header>
                            <p>We've found the following gravatar image associated with your e-mail address.</p>
                            <p>Is it okay to use this photo?</p>
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                      <Icon onClick={this.handleOpenDropzone.bind(this, key)} bordered link name="image" inverted color="grey" />
                      <Icon onClick={this.handleOpenEditor.bind(this, key)} bordered link name="folder open outline" inverted color="grey" />
                      <Icon onClick={this.handleOpenReader.bind(this, key)} style={{float: 'right'}} bordered link name="play" inverted color="red" />
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <Button onClick={this.handleCampaignCreate} size="huge" color="red" circular icon="plus" className="floating right" loading={this.state.loader.visible} />
      </Container>
    )
    return renderer()
  }
}

export default Campaigns
