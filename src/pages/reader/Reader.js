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
import { Container, Loader, Segment, Input, Message } from 'semantic-ui-react'

import ReaderStore from './libs/Store'
import ReaderActions from './libs/Actions'

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
    props.location.query.isWindows = is.windows()
    props.location.query.isMac = is.mac()
    props.location.query.isLinux = is.linux()
    props.location.query.isMobile = is.mobile()
    props.location.query.isTablet = is.tablet()
    props.location.query.isDesktop = is.desktop()
    props.location.query.isIE = is.ie()
    props.location.query.isFirefox = is.firefox()
    props.location.query.isChrome = is.chrome()
    props.location.query.isOpera = is.opera()
    props.location.query.isEdge = is.edge()
    props.location.query.isSafari = is.safari()
    // time to read the survey
    super(props)
    this.email = ''
    this.state = {
      individual: this.props.location.query.individual || cookie.load('individual'),
      withKeyboard: is.mobile(),
      readers: {
        abibao: Readers.AbibaoReader,
        ehop: Readers.EHOPReader
      }
    }
    this.store = ReaderStore
    this.handleChangeEmail = (email) => {
      this.email = email
    }
    this.handleSubmit = (e) => {
      console.log('Reader', 'handleSubmit', this.email)
      e.preventDefault()
      ReaderActions.controlSecurity(this.email)
    }
  }
  render () {
    console.log('Reader', 'render', this.state.selectedSurvey)
    let email = () => {
      return (
        <form onSubmit={this.handleSubmit} className="ui fluid container">
          <div className="abibao-reader">
            <div className="abibao-panel-heading">
              <h3><span /></h3>
            </div>
            <div className="abibao-panel-body">
              <div style={{background: '#e7ebee'}}>
                {!this.state.withKeyboard &&
                  <h4 className="abibao-page-title">Ce sondage est pour une bonne cause</h4>
                }
                <br />
                <Container fluid style={{background: '#e7ebee'}}>
                  <br />
                  <Segment basic>
                    <h5 className="abibao-question-title">Quelle est votre adresse email ?</h5>
                    <Input fluid disabled={this.state.loader.visible} onChange={(e) => this.handleChangeEmail(e.target.value)} type="email" placeholder="example@domain.com" size="large" label={{ color: 'grey', icon: 'asterisk' }} labelPosition="right corner" className="form" />
                  </Segment>
                  {!this.state.passwordless && <br />}
                  {this.state.passwordless &&
                    <Segment basic>
                      <Message info
                        icon="inbox"
                        header="Nous sommes heureux de vous revoir !"
                        content="Vous êtes déjà membre d'Abibao, un email vous a été envoyé avec un lien sécurisé pour accéder au sondage." />
                    </Segment>
                  }
                  <br />
                </Container>
              </div>
            </div>
            <div className="abibao-panel-footer" style={{textAlign: 'center'}}>
              {this.state.passwordless && <h4 className="abibao-footer-title">Un email <i className="hand peace icon" /> vous a été envoyé</h4>}
              {!this.state.passwordless && <input type="submit" className="abibao-button-nav" value="Suivant" />}
            </div>
          </div>
        </form>
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
