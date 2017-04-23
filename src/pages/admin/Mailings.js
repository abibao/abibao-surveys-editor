/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import { find } from 'lodash'

// semantic
import { Container, Loader, Segment, Header, Card, Icon, Label, Button, Image, Modal, Form, Dropdown } from 'semantic-ui-react'

// components
import AppBar from './components/AppBar'
import AppBarSubMenu from './components/AppBarSubMenu'

import AdminStore from './libs/Store'
import AdminActions from './libs/Actions'

class Mailings extends Reflux.Component {
  componentDidMount () {
    console.log('Mailings', 'componentDidMount')
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    console.log('Mailings', 'constructor')
    super(props)
    this.state = {
      modalSendgridOpen: false,
      selectedCampaign: false
    }
    this.store = AdminStore
    this.handleMailingCreate = () => {
      console.log('Mailings', 'handleMailingCreate')
      AdminActions.mailingCreate()
    }
    this.getTemplateNameById = (id) => {
      let template = find(this.state.templates, function (item) {
        return (item.key === id)
      })
      return (template) ? template.text : 'Pas de correspondance...'
    }
    this.handleCloseSendgrid = () => {
      this.setState({modalSendgridOpen: false})
    }
    this.handleOpenSendgrid = (key) => {
      this.setState({modalSendgridOpen: true})
    }
    this.handleRefreshTemplates = () => {
      console.log('Mailings', 'handleRefreshTemplates')
      AdminActions.templatesRefresh()
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
            Listes des mailings
            <Header.Subheader>Il y a actuellement {this.state.mailings.total_rows} mailings en ligne.</Header.Subheader>
          </Header>
          <Card.Group>
            {(this.state.mailings.rows).map((item) => (
              <Card key={item.id} color="red">
                <Card.Content>
                  <Image floated="right">
                    <Label color={(!item.doc.done) ? 'yellow' : 'green'}>
                      <Icon inverted />
                    </Label>
                  </Image>
                  <Card.Header>
                    {this.getTemplateNameById(item.doc.template)}
                  </Card.Header>
                  <Card.Meta>
                    Emails: {item.doc.emails.length}
                  </Card.Meta>
                  <Card.Description>
                    {item.doc.categories.join(', ')}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Icon onClick={this.handleOpenSendgrid.bind(this, item.id)} bordered link name="setting" inverted color="grey" />
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
                  <label>Template sendgrid</label>
                  <Form.Group>
                    <Dropdown options={this.state.templates.rows.map((item) => {
                      return {
                        key: item.doc.id,
                        text: item.doc.name,
                        value: item.doc.id
                      }
                    })} onChange={(e, data) => this.handleChangeSendgrid({key: 'template', val: data.value})} selection fluid search placeholder="Sélectionnez un template sendgrid" size="large" className="form" />
                    <Icon link color="grey" bordered inverted size="large" onClick={this.handleRefreshTemplates} name="refresh" />
                  </Form.Group>
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleCloseSendgrid} negative icon="close" labelPosition="right" content="Annuler" />
            <Button positive icon="checkmark" labelPosition="right" content="Envoyer" />
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
