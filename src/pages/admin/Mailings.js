/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Container, Loader, Table, Segment, Header } from 'semantic-ui-react'

// components
import AppBar from './components/AppBar'

import AdminStore from './libs/Store'

class Mailings extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {
      selectedCampaign: false
    }
    this.store = AdminStore
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
      <Container fluid className="editor">
        <AppBar />
        <Segment basic style={{marginTop: '77px'}}>
          <Header as="h2" color="red">
            Listes des mailings
            <Header.Subheader>Il y a actuellement {this.state.mailings.total_rows} mailings en ligne.</Header.Subheader>
          </Header>
          <Table selectable sortable celled color="red">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Template</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Updated</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Created</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Réponse</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Erreur</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.mailings.rows.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.doc.email}</Table.Cell>
                  <Table.Cell>{item.doc.template}</Table.Cell>
                  <Table.Cell textAlign="center">{item.doc.updated}</Table.Cell>
                  <Table.Cell textAlign="center">{item.doc.created}</Table.Cell>
                  <Table.Cell textAlign="center">{(item.doc.response === false) ? 'NON' : item.doc.response.statusCode}</Table.Cell>
                  <Table.Cell textAlign="center">{(item.doc.error === false) ? 'NON' : 'ERR'}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
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
