// actions
import ReaderActions from './Actions'

class ReaderHelpers {
  constructor (context) {
    console.log('ReaderHelpers', 'constructor')
    this.context = context
  }
  connect (client) {
    console.log('ReaderHelpers', 'connect', client.io.id)
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
    console.log('ReaderHelpers', 'disconnect')
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
    console.log('ReaderHelpers', 'authenticate')
    this.context.state.client.authenticate({strategy: 'local', email: 'reader@abibao.com', password: 'password'})
      .then((response) => {
        this.context.setState({loader: {
          visible: true,
          message: 'Authentification acceptée...'
        }})
        console.log('...', 'response')
        this.context.setState({token: response.accessToken})
        return this.context.state.client.passport.verifyJWT(response.accessToken)
      })
      .then(passport => {
        console.log('...', 'passport')
        console.log('...', 'state.initialized', this.context.state.initialized)
        ReaderActions.readerInitialize()
      })
      .catch((error) => {
        console.error('...', error.toString())
        if (error.toString().includes('NotAuthenticated')) {
          console.log('...', 'no jwt token found, now use strategy local')
          this.context.setState({loader: {
            visible: true,
            message: 'Authentification en cours...'
          }})
          this.context.setState({loader: {visible: false, message: ''}})
        }
      })
  }
  initialize () {
    console.log('ReaderHelpers', 'initialize', this.context.state.selectedCampaign)
    this.context.setState({
      initialized: true,
      loader: {
        visible: true,
        message: 'Chargement campagne en cours...'
      }
    })
  }
  controlMinimum (data) {
    console.log('ReaderHelpers', 'controlMinimum')
    this.context.setState({loader: {visible: true, message: 'Contrôle (1) en cours...'}})
    this.context.state.client.service('command/surveyControlMinimum').create(data).then((result) => {
      if (result) {
        this.context.state.surveys.unshift(result)
      }
      this.context.state.selectedSurvey = this.context.state.surveys.shift()
      this.context.setState({surveys: this.context.state.surveys, selectedSurvey: this.context.state.selectedSurvey, loader: {visible: false, message: ''}})
    }).catch((error) => {
      console.error(error)
      this.context.setState({loader: {visible: false, message: ''}})
    })
  }
  controlSecurity (email, campaign) {
    console.log('ReaderHelpers', 'controlSecurity', email)
    this.context.setState({loader: {visible: true, message: 'Contrôle (2) en cours...'}})
    this.context.state.client.service('command/surveyControlSecurity').create({email, campaign, location: window.location}).then((result) => {
      console.log('...', result)
      if (result.connected === true) {
        console.log('connected', result.connected)
        this.context.setState({passwordless: true})
      } else {
        console.log('connected', result.connected)
        this.context.setState({passwordless: false})
        window.location = window.location.origin + window.location.pathname + '?individual=' + result.urn + window.location.search.replace('?', '&')
      }
      this.context.setState({loader: {visible: false, message: ''}})
    }).catch((error) => {
      console.error(error)
      this.context.setState({loader: {visible: false, message: ''}})
    })
  }
  affectSurvey (data) {
    console.log('ReaderHelpers', 'affectSurvey', data.individual)
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
          console.log(data)
          return this.context.setState({loader: {visible: false, message: 'ERROR_SURVEY_ABIBAO_ALREADY_COMPLETE'}})
        }
        if (error.toString().includes('ERROR_INDIVIDUAL_CONTROL_SECURITY')) {
          console.error('we need to ask email')
          return this.context.setState({askEmail: true, loader: {visible: false, message: ''}})
        }
        console.error('...', error)
      })
  }
  answerSurvey (data) {
    this.context.state.client.service('command/individualAnswerSurvey').create(data).then((result) => {
    }).catch(console.error)
  }
  completeSurvey (data) {
    this.context.state.client.service('command/individualCompleteSurvey').create(data).then((response) => {
      if (this.context.state.surveys.length > 0) {
        this.context.state.selectedSurvey = this.context.state.surveys.shift()
        this.context.setState({surveys: this.context.state.surveys, selectedSurvey: this.context.state.selectedSurvey})
      }
    }).catch(console.error)
  }
  getScreenComplete (id) {
    this.context.state.client.service('query/getCampaignScreenCompleteMessage').find({query: {id}}).then((message) => {
      this.context.setState({screenComplete: message, loader: {visible: false, message: '...'}})
    }).catch(console.error)
  }
}

export default ReaderHelpers
