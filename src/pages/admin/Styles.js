/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import {clone} from 'lodash'

// semantic
import { Container, Loader, Button, Segment, Header, Card, Image, Modal, Form, Input, TextArea } from 'semantic-ui-react'

// components
import AppBar from './components/AppBar'
import AppBarSubMenu from './components/AppBarSubMenu'

import AdminStore from './libs/Store'
import AdminActions from './libs/Actions'

import Debug from 'debug'
const debug = Debug('abibao-platform:admin')

class Styles extends Reflux.Component {
  componentDidMount () {
    debug('Styles', 'componentDidMount')
  }
  componentWillUnmount () {
    debug('Styles', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    debug('Styles', 'constructor')
    super(props)
    this.state = {
      modalOpen: false,
      selectedStyle: false
    }
    this.store = AdminStore
    this.handleStyleCreate = () => {
      AdminActions.styleCreate()
    }
    this.handleChangeInformation = (prop) => {
      this.state.selectedStyle[prop.key] = prop.val
      this.setState({selectedStyle: this.state.selectedStyle})
    }
    this.handleOpenInformations = (key) => {
      this.setState({selectedStyle: clone(this.state.styles[key]), modalOpen: true})
    }
    this.handleCloseInformations = () => {
      this.setState({selectedStyle: false, modalOpen: false})
    }
    this.handleUpdateInformations = () => {
      AdminActions.styleUpdate(this.state.selectedStyle)
    }
  }
  render () {
    debug('Styles', 'render', this.state.loader.visible)
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
            Listes des styles
            <Header.Subheader>Il y a actuellement {Object.keys(this.state.styles).length || 0} styles en ligne</Header.Subheader>
          </Header>
          <Card.Group>
            {Object.keys(this.state.styles).map((key) => (
              <Card key={key} color="red">
                <Image height="140" src={window.location.origin + '/' + this.state.styles[key].picture} />
                <Card.Content>
                  <Card.Header>
                    {this.state.styles[key].name}
                  </Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <Button onClick={this.handleOpenInformations.bind(this, key)} inverted color="blue" icon="setting" />
                  <Button disabled inverted color="blue" icon="image" />
                  <Button disabled inverted color="blue" icon="folder open outline" />
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Segment>
        <Modal open={this.state.modalOpen}>
          <Header size="huge" color="red" content="Informations" subheader="metadata d'un style" />
          <Modal.Content image>
            <Image height="140" wrapped size="medium" src={window.location.origin + '/' + this.state.selectedStyle.picture} />
            <Modal.Description className="campaigns">
              <Form>
                <Form.Field>
                  <label>Nom du style</label>
                  <Input onChange={(e) => this.handleChangeInformation({key: 'name', val: e.target.value})} defaultValue={this.state.selectedStyle.name} size="large" label={{ color: 'red', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                </Form.Field>
                <Form.Field>
                  <label>CSS du style</label>
                  <TextArea defaultValue={this.state.selectedStyle.css} autoHeight onChange={(e) => this.handleChangeInformation({key: 'css', val: e.target.value})} placeholder="Ecrivez votre surcharge CSS." size="large" className="form" />
                </Form.Field>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleCloseInformations} negative icon="close" labelPosition="right" content="Annuler" />
            <Button onClick={this.handleUpdateInformations} positive icon="checkmark" labelPosition="right" content="Sauver" />
          </Modal.Actions>
        </Modal>
        <Button onClick={this.handleStyleCreate} size="huge" color="red" circular icon="plus" className="floating right" loading={this.state.loader.visible} />
      </Container>
    )
    if (this.state.loader.visible === true) {
      return loader()
    } else {
      return renderer()
    }
  }
}

export default Styles
