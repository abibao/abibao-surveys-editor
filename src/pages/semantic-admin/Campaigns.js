/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import Dropzone from 'react-dropzone'
import {browserHistory} from 'react-router'
import {clone} from 'lodash'

// semantic
import { Container, Form, Segment, Menu, Icon, Input, Button, Header, Sidebar, Card, Image, Modal } from 'semantic-ui-react'

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
      menuOpen: false,
      modalOpen: false,
      selectedCampaign: false
    }
    this.store = ApplicationStore
    this.toggleVisibility = () => this.setState({ menuOpen: !this.state.menuOpen })
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
    this.handleOpenInformations = (key) => {
      console.log('Campaigns', 'handleOpenInformations', key)
      this.setState({selectedCampaign: clone(this.state.campaigns[key]), modalOpen: true})
    }
    this.handleChangeInformation = (prop) => {
      console.log('Campaigns', 'handleChangeInformation')
      this.state.selectedCampaign[prop.key] = prop.val
      this.setState({selectedCampaign: this.state.selectedCampaign})
    }
    this.handleCloseInformations = () => {
      console.log('Campaigns', 'handleCloseInformations')
      this.setState({selectedCampaign: false, modalOpen: false})
    }
    this.handleUpdateInformations = () => {
      console.log('Campaigns', 'handleUpdateInformations')
      CampaignActions.campaignUpdate(this.state.selectedCampaign)
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
          <Sidebar as={Menu} animation="push" visible={this.state.menuOpen} icon="labeled" vertical inverted color="grey">
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
                      <Icon onClick={this.handleOpenInformations.bind(this, key)} bordered link name="setting" inverted color="grey" />
                      <Icon onClick={this.handleOpenDropzone.bind(this, key)} bordered link name="image" inverted color="grey" />
                      <Icon onClick={this.handleOpenEditor.bind(this, key)} bordered link name="folder open outline" inverted color="grey" />
                      <Icon onClick={this.handleOpenReader.bind(this, key)} style={{float: 'right'}} bordered link name="play" inverted color="red" />
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>
            </Segment>
            <Modal open={this.state.modalOpen}>
              <Header size="huge" color="red" content="Informations" subheader="metadata d'une campagne" />
              <Modal.Content image>
                <Image wrapped size="medium" src={process.env.REACT_APP_FEATHERS_URI + '/' + this.state.selectedCampaign.picture} />
                <Modal.Description className="campaigns">
                  <Form>
                    <Form.Field>
                      <label>Nom de la campagne</label>
                      <Input onChange={(e) => this.handleChangeInformation({key: 'name', val: e.target.value})} defaultValue={this.state.selectedCampaign.name} size="large" label={{ color: 'red', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                    </Form.Field>
                  </Form>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.handleCloseInformations} negative icon="close" labelPosition="right" content="Annuler" />
                <Button onClick={this.handleUpdateInformations} positive icon="checkmark" labelPosition="right" content="Sauver" />
              </Modal.Actions>
            </Modal>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <Button onClick={this.handleCampaignCreate} size="huge" color="red" circular icon="plus" className="floating right" loading={this.state.loader.visible} />
      </Container>
    )
    return renderer()
  }
}

export default Campaigns
