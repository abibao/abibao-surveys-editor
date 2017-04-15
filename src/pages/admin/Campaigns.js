/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import Dropzone from 'react-dropzone'
import {clone} from 'lodash'

// semantic
import { Container, Form, Segment, Icon, Input, Button, Header, Card, Image, Modal, TextArea } from 'semantic-ui-react'

// store
import AdminStore from './../../stores/AdminStore'

// actions
import CampaignActions from './../../actions/CampaignActions'

const host = process.env.REACT_APP_FEATHERS_URI

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
      modalSendgridOpen: false,
      selectedCampaign: false,
      selectedSendgrid: false
    }
    this.store = AdminStore
    this.toggleVisibility = () => this.setState({ menuOpen: !this.state.menuOpen })
    this.handleChangePicture = (files) => {
      CampaignActions.campaignUpdatePicture(this.state.selectedCampaign.id, files[0])
    }
    this.handleOpenEditor = (key) => {
      window.open('/admin/campaigns/' + key + '/editor', '_blank')
    }
    this.handleOpenReader = (key) => {
      window.open('/reader/' + key + '?tags=admin&tags=test', '_blank')
    }
    this.handleCloseSendgrid = () => {
      this.setState({selectedCampaign: false, selectedSendgrid: false, modalSendgridOpen: false})
    }
    this.handleOpenSendgrid = (key) => {
      this.setState({selectedCampaign: clone(this.state.campaigns[key]), selectedSendgrid: {template: 'empty', emails: [], url: window.location.origin}, modalSendgridOpen: true})
    }
    this.handleChangeSendgrid = (prop) => {
      if (prop.key === 'emails') {
        prop.val = prop.val.split('\n')
      }
      this.state.selectedSendgrid[prop.key] = prop.val
      this.setState({selectedSendgrid: this.state.selectedSendgrid})
    }
    this.handleSendSendgrid = () => {
      CampaignActions.campaignEmailing({
        emails: this.state.selectedSendgrid.emails,
        url: this.state.selectedSendgrid.url,
        campaign: this.state.selectedCampaign.id,
        template: this.state.selectedSendgrid.template
      })
    }
    this.handleOpenInformations = (key) => {
      this.setState({selectedCampaign: clone(this.state.campaigns[key]), modalOpen: true})
    }
    this.handleChangeInformation = (prop) => {
      this.state.selectedCampaign[prop.key] = prop.val
      this.setState({selectedCampaign: this.state.selectedCampaign})
    }
    this.handleCloseInformations = () => {
      this.setState({selectedCampaign: false, modalOpen: false})
    }
    this.handleUpdateInformations = () => {
      CampaignActions.campaignUpdate(this.state.selectedCampaign)
    }
    this.handleOpenDropzone = (key) => {
      this.setState({selectedCampaign: this.state.campaigns[key]})
      this.refs.dropzone.open()
    }
    this.handleCampaignCreate = () => {
      CampaignActions.campaignCreate()
    }
  }
  render () {
    console.log('Campaigns', 'render')
    let renderer = () => (
      <Container fluid>
        <Header as="h1" attached inverted color="red" className="appbar">
          <Icon name="settings" />
          <Header.Content>
            ABIBAO
            <Header.Subheader>
              platform
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Segment basic loading={this.state.loader.visible}>
          <Header as="h2" color="red">
            Listes des campagnes
            <Header.Subheader>Il y a actuellement {Object.keys(this.state.campaigns).length || 0} campagnes en lignes.</Header.Subheader>
          </Header>
          <Dropzone style={{display: 'none'}} ref="dropzone" multiple={false} onDrop={this.handleChangePicture} />
          <Card.Group>
            {Object.keys(this.state.campaigns).map((key) => (
              <Card key={key}>
                <Image height="140" src={host + '/' + this.state.campaigns[key].picture} />
                <Card.Content>
                  <Card.Header>
                    {this.state.campaigns[key].name}
                  </Card.Header>
                  <Card.Meta>
                    <span>
                      {this.state.campaigns[key].company}
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
                  <Icon onClick={this.handleOpenSendgrid.bind(this, key)} style={{float: 'right'}} bordered link name="mail" inverted color="blue" />
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Segment>
        <Modal open={this.state.modalSendgridOpen}>
          <Header size="huge" color="red" content="Sendgrid" subheader="diffusion d'une campagne" />
          <Modal.Content image>
            <Image height="140" wrapped size="medium" src={host + '/' + this.state.selectedCampaign.picture} />
            <Modal.Description className="campaigns">
              <Form>
                <Form.Field>
                  <label>Template sendgrid</label>
                  <Input onChange={(e) => this.handleChangeSendgrid({key: 'template', val: e.target.value})} defaultValue="" size="large" label={{ color: 'red', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                  <label>Liste des emails</label>
                  <TextArea onChange={(e) => this.handleChangeSendgrid({key: 'emails', val: e.target.value})} placeholder="Ajouter la liste de diffusion" />
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleCloseSendgrid} negative icon="close" labelPosition="right" content="Annuler" />
            <Button onClick={this.handleSendSendgrid} positive icon="checkmark" labelPosition="right" content="Envoyer" />
          </Modal.Actions>
        </Modal>
        <Modal open={this.state.modalOpen}>
          <Header size="huge" color="red" content="Informations" subheader="metadata d'une campagne" />
          <Modal.Content image>
            <Image height="140" wrapped size="medium" src={host + '/' + this.state.selectedCampaign.picture} />
            <Modal.Description className="campaigns">
              <Form>
                <Form.Field>
                  <label>Nom de la campagne</label>
                  <Input onChange={(e) => this.handleChangeInformation({key: 'name', val: e.target.value})} defaultValue={this.state.selectedCampaign.name} size="large" label={{ color: 'red', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                  <label>Compagnie associée</label>
                  <Input onChange={(e) => this.handleChangeInformation({key: 'company', val: e.target.value})} defaultValue={this.state.selectedCampaign.company} size="large" label={{ color: 'red', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                  <label>Reader associé</label>
                  <Input onChange={(e) => this.handleChangeInformation({key: 'reader', val: e.target.value})} defaultValue={this.state.selectedCampaign.reader} size="large" label={{ color: 'red', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                  <label>Position de la campagne</label>
                  <Input onChange={(e) => this.handleChangeInformation({key: 'position', val: e.target.value})} defaultValue={this.state.selectedCampaign.position} size="large" className="form" />
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleCloseInformations} negative icon="close" labelPosition="right" content="Annuler" />
            <Button onClick={this.handleUpdateInformations} positive icon="checkmark" labelPosition="right" content="Sauver" />
          </Modal.Actions>
        </Modal>
        <Button onClick={this.handleCampaignCreate} size="huge" color="red" circular icon="plus" className="floating right" loading={this.state.loader.visible} />
      </Container>
    )
    return renderer()
  }
}

export default Campaigns
