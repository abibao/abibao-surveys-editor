// actions
import ReaderActions from './Actions'

import Debug from 'debug'
const debug = Debug('abibao-platform:reader')
const debugerror = Debug('abibao-platform:error')

class ReaderHelpers {
  constructor (context) {
    debug('ReaderHelpers', 'constructor')
    this.context = context
  }
  connect (client) {
    debug('ReaderHelpers', 'connect', client.io.id)
    this.context.setState({
      client,
      socket: client.io.id,
      loader: {
        visible: true,
        message: 'Connexion acceptée...'
      }
    })
    this.authenticate()
  }
  disconnect () {
    debug('ReaderHelpers', 'disconnect')
    this.context.setState({
      selectedCampaign: false,
      initialized: false,
      loader: {
        visible: true,
        message: 'Connexion perdue...'
      }
    })
  }
  authenticate () {
    debug('ReaderHelpers', 'authenticate')
    this.context.state.client.authenticate({strategy: 'local', email: 'reader@abibao.com', password: 'password'})
      .then((response) => {
        this.context.setState({loader: {
          visible: true,
          message: 'Authentification acceptée...'
        }})
        debug('...', 'response')
        this.context.setState({token: response.accessToken})
        return this.context.state.client.passport.verifyJWT(response.accessToken)
      })
      .then(passport => {
        debug('...', 'passport')
        debug('...', 'state.initialized', this.context.state.initialized)
        ReaderActions.readerInitialize()
      })
      .catch((error) => {
        debugerror('...', error.toString())
        if (error.toString().includes('NotAuthenticated')) {
          debug('...', 'no jwt token found, now use strategy local')
          this.context.setState({loader: {
            visible: true,
            message: 'Authentification en cours...'
          }})
          this.context.setState({loader: {visible: false, message: ''}})
        }
      })
  }
  initialize () {
    debug('ReaderHelpers', 'initialize', this.context.state.selectedCampaign)
    this.context.setState({
      initialized: true,
      loader: {
        visible: true,
        message: 'Chargement campagne en cours...'
      }
    })
  }
  controlMinimum (data) {
    debug('ReaderHelpers', 'controlMinimum')
    this.context.setState({loader: {visible: true, message: 'Contrôle (1) en cours...'}})
    this.context.state.client.service('command/surveyControlMinimum').create(data).then((result) => {
      if (result) {
        this.context.state.surveys.unshift(result)
      }
      this.context.state.selectedSurvey = this.context.state.surveys.shift()
      this.context.setState({surveys: this.context.state.surveys, selectedSurvey: this.context.state.selectedSurvey, loader: {visible: false, message: ''}})
    }).catch((error) => {
      debugerror(error)
      this.context.setState({loader: {visible: false, message: ''}})
    })
  }
  controlSecurity (email, campaign) {
    debug('ReaderHelpers', 'controlSecurity', email)
    this.context.setState({loader: {visible: true, message: 'Contrôle (2) en cours...'}})
    this.context.state.client.service('command/surveyControlSecurity').create({email, campaign, location: window.location}).then((result) => {
      debug('...', result)
      if (result.connected === true) {
        debug('connected', result.connected)
        this.context.setState({passwordless: true})
      } else {
        debug('connected', result.connected)
        this.context.setState({passwordless: false})
        window.location = window.location.origin + window.location.pathname + '?individual=' + result.urn + window.location.search.replace('?', '&')
      }
      this.context.setState({loader: {visible: false, message: ''}})
    }).catch((error) => {
      if (error.toString().includes('ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE')) {
        return this.context.setState({loader: {visible: false, message: 'ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE'}})
      } else {
        this.context.setState({loader: {visible: true, message: error.toString()}})
      }
    })
  }
  affectSurvey (data) {
    debug('ReaderHelpers', 'affectSurvey', data.individual)
    this.context.state.client.service('command/individualAffectSurvey').create(data)
      .then((response) => {
        this.context.state.surveys.unshift(response)
        if (response.campaign.reader === 'abibao') {
          ReaderActions.controlMinimum(data)
        } else {
          this.context.state.selectedSurvey = this.context.state.surveys.shift()
          this.context.setState({surveys: this.context.state.surveys, selectedSurvey: this.context.state.selectedSurvey, loader: {visible: false, message: ''}})
        }
      })
      .catch((error) => {
        if (error.toString().includes('ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE')) {
          return this.context.setState({loader: {visible: false, message: 'ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE'}})
        }
        if (error.toString().includes('ERROR_INDIVIDUAL_CONTROL_SECURITY')) {
          debugerror('we need to ask email')
          return this.context.setState({askEmail: true, loader: {visible: false, message: ''}})
        }
        debugerror('...', error)
      })
  }
  answerSurvey (data) {
    this.context.state.client.service('command/individualAnswerSurvey').create(data).then((result) => {
    }).catch(debugerror)
  }
  completeSurvey (data) {
    this.context.state.client.service('command/individualCompleteSurvey').create(data).then((response) => {
      if (this.context.state.surveys.length > 0) {
        this.context.state.selectedSurvey = this.context.state.surveys.shift()
        this.context.setState({surveys: this.context.state.surveys, selectedSurvey: this.context.state.selectedSurvey})
      }
    }).catch(debugerror)
  }
  getScreenComplete (id) {
    this.context.state.client.service('query/getCampaignScreenCompleteMessage').find({query: {id}}).then((message) => {
      this.context.setState({screenComplete: message, loader: {visible: false, message: '...'}})
    }).catch(debugerror)
  }
}

export default ReaderHelpers
