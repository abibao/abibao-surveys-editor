/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import { find } from 'lodash'

// semantic
import { Container, Loader, Segment, Header, Card, Icon } from 'semantic-ui-react'

// components
import AppBar from './components/AppBar'
import AppBarSubMenu from './components/AppBarSubMenu'

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
    this.getTemplateNameById = (id) => {
      let template = find(this.state.templates, function (item) {
        return (item.key === id)
      })
      return (template.text || 'Not found...')
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
                  <Card.Header>{this.getTemplateNameById(item.doc.template)}</Card.Header>
                  <Card.Meta>{item.doc.email}</Card.Meta>
                  <Card.Description>{item.doc.body.categories.join(',')}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Icon name="user" />
                  22 Friends
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
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
