/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import ReactMarkdown from 'react-markdown'
import cookie from 'react-cookies'
import uuid from 'uuid'
import is from 'is_js'

import './main.css'

// components
import Player from './Player'

// semantic
import { Container, Loader, Segment, Input, Message } from 'semantic-ui-react'

import ReaderStore from './libs/Store'
import ReaderActions from './libs/Actions'

// styles
import 'github-markdown-css'
import './markdown.css'

import Debug from 'debug'
const debug = Debug('abibao-platform:reader')

class Reader extends Reflux.Component {
  componentDidMount () {
    debug('Reader', 'componentDidMount')
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.initialized === true && this.state.selectedCampaign === false) {
      debug('Reader', 'initialized')
      this.setState({selectedCampaign: this.props.params.id})
      ReaderActions.affectSurvey({individual: this.state.individual, campaign: this.props.params.id, params: this.props.location.query})
    }
  }
  constructor (props) {
    debug('Reader', 'constructor', props.params.id)
    let mycookie = cookie.load('individual')
    if (mycookie === undefined) {
      debug('Reader', 'make fingerprint')
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
      withKeyboard: is.mobile()
    }
    this.store = ReaderStore
    this.handleChangeEmail = (email) => {
      this.email = email
    }
    this.handleSubmit = (e) => {
      debug('Reader', 'handleSubmit', this.email)
      e.preventDefault()
      if (!this.email) {
        return false
      }
      ReaderActions.controlSecurity(this.email, this.props.params.id)
    }
  }
  render () {
    debug('Reader', 'render', this.state.selectedSurvey)
    if (this.state.loader.message === 'ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE') {
      ReaderActions.getScreenComplete(this.props.params.id)
      return (<div />)
    }
    let email = () => {
      return (
        <form onSubmit={this.handleSubmit} className={is.mobile() ? 'global-mobile' : ''}>
          <div className="global reader">
            <div className="global body">
              <div>
                {!this.state.withKeyboard &&
                  <h4 className="global page title">Ce sondage est pour une bonne cause</h4>
                }
                <br />
                <Container fluid>
                  <br />
                  <Segment basic>
                    <h5 className="global question title">Quelle est votre adresse email ?</h5>
                    <Input fluid disabled={this.state.loader.visible} onChange={(e) => this.handleChangeEmail(e.target.value)} type="email" placeholder="example@domain.com" size="large" />
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
            <div className="global footer" style={{textAlign: 'center'}}>
              {this.state.passwordless && <h4>Un email <i className="hand peace icon" /> vous a été envoyé</h4>}
              {!this.state.passwordless && <input type="submit" className="global button nav" value="Suivant" />}
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
    if (this.state.selectedSurvey) {
      document.body.className = this.state.selectedSurvey.campaign.reader
      if (this.props.location.query.isMobile === true) {
        document.body.className += ' mobile'
      }
    }
    if (this.state.screenComplete !== false) {
      return (
        <div>
          <ReactMarkdown className="markdown-body" source={this.state.screenComplete} />
        </div>
      )
    }
    if (this.state.askEmail === true) {
      return email()
    }
    if (this.state.loader.visible === true) {
      return loader()
    } else {
      return (
        <div className={'reader-' + this.state.selectedSurvey.campaign.reader}>
          <Player survey={this.state.selectedSurvey} client={this.state.client} />
        </div>
      )
    }
  }
}

export default Reader
