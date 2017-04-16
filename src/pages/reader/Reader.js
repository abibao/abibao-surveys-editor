/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import cookie from 'react-cookie'
import uuid from 'uuid'
import is from 'is_js'

// components
import * as Readers from './components/readers'

// semantic
import { Container, Loader, Header, Segment, Input, Form, Button, Message } from 'semantic-ui-react'

import ReaderStore from './../../stores/ReaderStore'
import ReaderActions from './../../actions/ReaderActions'

class Reader extends Reflux.Component {
  componentDidMount () {
    console.log('Reader', 'componentDidMount')
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.initialized === true && this.state.selectedCampaign === false) {
      console.log('Reader', 'initialized')
      this.setState({selectedCampaign: this.props.params.id})
      ReaderActions.affectSurvey({individual: this.state.individual, campaign: this.props.params.id, params: this.props.location.query})
    }
  }
  constructor (props) {
    console.log('Reader', 'constructor', props.params.id)
    let mycookie = cookie.load('individual')
    if (mycookie === undefined) {
      console.log('Reader', 'make fingerprint')
      let fingerprint = 'urn:fingerprint:individual:' + uuid.v4()
      cookie.save('individual', fingerprint, { path: '/' })
    }
    props.location.query.isMobile = is.mobile()
    props.location.query.isTablet = is.tablet()
    props.location.query.isDesktop = is.desktop()
    // time to read the survey
    super(props)
    this.state = {
      individual: this.props.location.query.individual || cookie.load('individual'),
      email: 'example@domain.com',
      readers: {
        abibao: Readers.AbibaoReader,
        ehop: Readers.EHOPReader
      }
    }
    this.store = ReaderStore
    this.handleChangeEmail = (email) => {
      this.setState({email})
    }
    this.handleSubmit = () => {
      console.log('Reader', 'handleSubmit', this.state.email)
      ReaderActions.controlSecurity(this.state.email)
    }
  }
  render () {
    console.log('Reader', 'render')
    let email = () => {
      return (
        <div className="ui fluid container">
          <div className="abibao-reader">
            <div className="abibao-panel-heading">
              <h3 />
            </div>
            <div className="abibao-panel-body">
              <div style={{background: '#e7ebee'}}>
                <h4 className="abibao-page-title">Vous êtes quelqu'un d'incroyable !</h4>
                <br />
                <Container fluid style={{background: '#e7ebee'}}>
                  <Segment basic>
                    <Header as="h2">
                      Le monde caritatif à besoin de gens comme vous !
                      <Header.Subheader>Pour répondre à ce sondge et être alerté des sondages à venir, laissez nous votre e-mail :</Header.Subheader>
                    </Header>
                  </Segment>
                  <Segment basic>
                    <Form>
                      <Form.Field>
                        <Input disabled={this.state.loader.visible} onChange={(e) => this.handleChangeEmail(e.target.value)} type="email" placeholder={this.state.email} size="large" label={{ color: 'grey', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                      </Form.Field>
                    </Form>
                    <br />
                    <Button loading={this.state.loader.visible} onClick={this.handleSubmit} color="grey" size="large" content="Se connecter" />
                  </Segment>
                  <Segment basic hidden={!this.state.passwordless}>
                    <Message info
                      icon="inbox"
                      header="Message de sécurité"
                      content="Un email d’accès vous a été envoyé" />
                  </Segment>
                </Container>
                <br />
              </div>
            </div>
            <div className="abibao-panel-footer">
              <Header as="h3" textAlign="center" style={{color: '#ffffff'}}>Vous allez reçevoir un email avec le lien du sondage</Header>
            </div>
          </div>
        </div>
      )
    }
    let loader = () => {
      return (
        <Container fluid className="loader-reader">
          <Loader active size="huge">{this.state.loader.message}</Loader>
        </Container>
      )
    }
    let renderer = (CurrentReader) => (
      <Container fluid>
        <CurrentReader survey={this.state.selectedSurvey} client={this.state.client} />
      </Container>
    )
    if (this.state.askEmail === true) {
      return email()
    }
    if (this.state.loader.visible === true) {
      return loader()
    } else {
      const label = this.state.selectedSurvey.campaign.reader
      const reader = this.state.readers[label]
      return renderer(reader)
    }
  }
}

export default Reader
