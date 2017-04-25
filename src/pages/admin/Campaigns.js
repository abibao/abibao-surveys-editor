/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import Dropzone from 'react-dropzone'
import {clone} from 'lodash'

// semantic
import { Container, Form, Segment, Input, Button, Header, Card, Image, Modal, Loader } from 'semantic-ui-react'

// components
import AppBar from './components/AppBar'
import AppBarSubMenu from './components/AppBarSubMenu'

import AdminStore from './libs/Store'
import AdminActions from './libs/Actions'

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
    this.store = AdminStore
    this.toggleVisibility = () => this.setState({ menuOpen: !this.state.menuOpen })
    this.handleChangePicture = (files) => {
      AdminActions.campaignUpdatePicture(this.state.selectedCampaign.id, files[0])
    }
    this.handleOpenEditor = (key) => {
      window.open('/admin/campaigns/' + key + '/editor', '_blank')
    }
    this.handleOpenReader = (key) => {
      window.open('/reader/' + key + '?tags=admin&tags=test', '_blank')
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
      AdminActions.campaignUpdate(this.state.selectedCampaign)
    }
    this.handleOpenDropzone = (key) => {
      this.setState({selectedCampaign: this.state.campaigns[key]})
      this.refs.dropzone.open()
    }
    this.handleCampaignCreate = () => {
      AdminActions.campaignCreate()
    }
  }
  render () {
    console.log('Campaigns', 'render', this.state.loader.visible)
    let loader = () => {
      return (
        <Container fluid className="loader-reader">
          <Loader active size="huge">{this.state.loader.message}</Loader>
        </Container>
      )
    }
    let renderer = () => (
      <Container fluid style={{paddingTop: '120px'}}>
        <AppBar />
        <AppBarSubMenu />
        <Segment basic>
          <Header as="h2" color="red">
            Listes des campagnes
            <Header.Subheader>Il y a actuellement {Object.keys(this.state.campaigns).length || 0} campagnes en ligne</Header.Subheader>
          </Header>
          <Dropzone style={{display: 'none'}} ref="dropzone" multiple={false} onDrop={this.handleChangePicture} />
          <Card.Group>
            {Object.keys(this.state.campaigns).map((key) => (
              <Card key={key} color="red">
                <Image height="140" src={window.location.origin + '/' + this.state.campaigns[key].picture} />
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
                  <Button onClick={this.handleOpenInformations.bind(this, key)} inverted color="blue" icon="setting" />
                  <Button onClick={this.handleOpenDropzone.bind(this, key)} inverted color="blue" icon="image" />
                  <Button onClick={this.handleOpenEditor.bind(this, key)} inverted color="blue" icon="folder open outline" />
                  <Button onClick={this.handleOpenReader.bind(this, key)} floated="right" inverted color="red" icon="play" />
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Segment>
        <Modal open={this.state.modalOpen}>
          <Header size="huge" color="red" content="Informations" subheader="metadata d'une campagne" />
          <Modal.Content image>
            <Image height="140" wrapped size="medium" src={window.location.origin + '/' + this.state.selectedCampaign.picture} />
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
    if (this.state.loader.visible === true) {
      return loader()
    } else {
      return renderer()
    }
  }
}

export default Campaigns
