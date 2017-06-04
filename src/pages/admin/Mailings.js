/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import { find, clone } from 'lodash'

// semantic
import { Container, Loader, Segment, Header, Card, Button, Modal, Form, Dropdown, Input, TextArea, Label } from 'semantic-ui-react'

// components
import AppBar from './components/AppBar'
import AppBarSubMenu from './components/AppBarSubMenu'

import AdminStore from './libs/Store'
import AdminActions from './libs/Actions'

import Debug from 'debug'
const debug = Debug('abibao-platform:admin')

class Mailings extends Reflux.Component {
  componentDidMount () {
    debug('Mailings', 'componentDidMount')
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    debug('Mailings', 'constructor')
    super(props)
    this.state = {
      modalSendgridOpen: false,
      selectedMailing: false
    }
    this.store = AdminStore
    this.handleMailingCreate = () => {
      debug('Mailings', 'handleMailingCreate')
      AdminActions.mailingCreate()
    }
    this.getTemplateById = (id) => {
      if (this.state.templates.total_rows === 0) {
        return {doc: {name: 'Pas de correspondance...'}}
      }
      let template = find(this.state.templates.rows, function (item) {
        return (item.key === id)
      })
      return template || {doc: {name: 'Pas de correspondance...'}}
    }
    this.handleUpdateSendgrid = () => {
      AdminActions.mailingUpdate(this.state.selectedMailing)
    }
    this.handleCloseSendgrid = () => {
      this.setState({modalSendgridOpen: false, selectedMailing: false})
    }
    this.handleOpenSendgrid = (key) => {
      this.state.mailings.rows.map((item) => {
        if (item.id === key) {
          return this.setState({modalSendgridOpen: true, selectedMailing: clone(item.doc)})
        }
        return true
      })
    }
    this.handleRefreshTemplates = () => {
      debug('Mailings', 'handleRefreshTemplates')
      AdminActions.templatesRefresh()
    }
    this.handleChangeSendgrid = (prop) => {
      if (prop.key === 'emails') {
        prop.val = prop.val.split('\n')
      }
      if (prop.key === 'categories') {
        prop.val = prop.val.split('\n')
      }
      this.state.selectedMailing[prop.key] = prop.val
      this.setState({selectedMailing: this.state.selectedMailing})
    }
    this.handleSendSendgrid = (id) => {
      AdminActions.campaignEmailing(id)
    }
  }
  render () {
    debug('Campaigns', 'render', this.state.loader.visible)
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
            Listes des mailings
            <Header.Subheader>Il y a actuellement {this.state.mailings.total_rows} mailings en ligne.</Header.Subheader>
          </Header>
          <Card.Group>
            {(this.state.mailings.rows).map((item) => (
              <Card key={item.id} color={(item.doc.done) ? 'green' : 'red'}>
                <Card.Content>
                  <Card.Header>
                    <Label attached="top right">{item.doc.emails.length}</Label>
                    {(this.state.campaigns[item.doc.campaign]) ? this.state.campaigns[item.doc.campaign].name : 'Sélectionnez une campagne'}
                  </Card.Header>
                  <Card.Meta>
                    {item.doc.name}
                  </Card.Meta>
                  <Card.Description>
                    <strong>Template</strong><br />
                    {this.getTemplateById(item.doc.template).doc.name}<br />
                    <strong>Catégories</strong><br />{(item.doc.categories.length > 0) ? item.doc.categories.join(', ') : 'Aucune'}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button onClick={this.handleOpenSendgrid.bind(this, item.id)} inverted color="blue" icon="setting" />
                  <Button onClick={this.handleRefreshTemplates} inverted color="blue" icon="refresh" />
                  <Button onClick={this.handleSendSendgrid.bind(this, item.id)} floated="right" inverted color="red" icon="play" />
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Segment>
        <Modal open={this.state.modalSendgridOpen}>
          <Header size="huge" color="red" content="Sendgrid" subheader="diffusion d'une campagne" />
          <Modal.Content>
            <Modal.Description className="campaigns">
              <Form>
                <Form.Field>
                  <label>Nom de la session</label>
                  <Input onChange={(e) => this.handleChangeSendgrid({key: 'name', val: e.target.value})} defaultValue={this.state.selectedMailing.name} size="large" label={{ color: 'red', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                </Form.Field>
                <Form.Field>
                  <label>Campagne associée</label>
                  <Dropdown options={Object.keys(this.state.campaigns).map((key) => {
                    return {
                      key: this.state.campaigns[key].id,
                      text: this.state.campaigns[key].name,
                      value: this.state.campaigns[key].id
                    }
                  })} defaultValue={this.state.selectedMailing.campaign} onChange={(e, data) => this.handleChangeSendgrid({key: 'campaign', val: data.value})} selection fluid search placeholder="Sélectionnez un template sendgrid" size="large" className="form" />
                </Form.Field>
                <Form.Field>
                  <label>Template sendgrid</label>
                  <Dropdown options={this.state.templates.rows.map((item) => {
                    return {
                      key: item.doc.id,
                      text: item.doc.name,
                      value: item.doc.id
                    }
                  })} defaultValue={this.state.selectedMailing.template} onChange={(e, data) => this.handleChangeSendgrid({key: 'template', val: data.value})} selection fluid search placeholder="Sélectionnez un template sendgrid" size="large" className="form" />
                </Form.Field>
                <Form.Field>
                  <label>Liste des catégories</label>
                  <TextArea defaultValue={(this.state.selectedMailing.categories) ? this.state.selectedMailing.categories.join('\n') : this.state.selectedMailing.categories} autoHeight onChange={(e) => this.handleChangeSendgrid({key: 'categories', val: e.target.value})} placeholder="Ajouter les catégories de diffusion" size="large" className="form" />
                </Form.Field>
                <Form.Field>
                  <label>Liste des emails</label>
                  <TextArea defaultValue={(this.state.selectedMailing.emails) ? this.state.selectedMailing.emails.join('\n') : this.state.selectedMailing.emails} onChange={(e) => this.handleChangeSendgrid({key: 'emails', val: e.target.value})} placeholder="Ajouter la liste de diffusion" size="large" className="form" />
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleCloseSendgrid} negative icon="close" labelPosition="right" content="Annuler" />
            <Button onClick={this.handleUpdateSendgrid} positive icon="checkmark" labelPosition="right" content="Sauver" />
          </Modal.Actions>
        </Modal>
        <Button onClick={this.handleMailingCreate} size="huge" color="red" circular icon="plus" className="floating right" loading={this.state.loader.visible} />
      </Container>
    )
    if (this.state.loader.visible === true) {
      return loader()
    } else {
      return renderer()
    }
  }
}

export default Mailings
