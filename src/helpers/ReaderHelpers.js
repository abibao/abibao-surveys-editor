// actions
import ReaderActions from './../actions/ReaderActions'

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
  controlSecurity (email) {
    console.log('ReaderHelpers', 'control security')
    this.context.setState({loader: {visible: true, message: ''}})
    this.context.state.client.service('command/surveyControlSecurity').create({email, origin: window.location.href}).then((result) => {
      console.log('...', result)
      if (result.connected === true) {
        console.log('connected', result.connected)
        this.context.setState({passwordless: true})
      } else {
        console.log('connected', result.connected)
        this.context.setState({passwordless: false})
        window.location = window.location.href + '&individual=' + result.urn
      }
      this.context.setState({loader: {visible: false, message: ''}})
    }).catch((error) => {
      console.error(error)
      this.context.setState({loader: {visible: false, message: ''}})
    })
  }
  affectSurvey (data) {
    console.log('ReaderHelpers', 'affect', data.individual)
    this.context.state.client.service('command/individualAffectSurvey').create(data)
      .then((response) => {
        this.context.setState({selectedSurvey: response, loader: {visible: false, message: ''}})
      })
      .catch((error) => {
        if (error.toString().includes('ERROR_INDIVIDUAL_CONTROL_SECURITY')) {
          console.error('we need to ask email')
          this.context.setState({askEmail: true, loader: {visible: false, message: ''}})
        } else {
          console.error('...', error)
        }
      })
  }
  answerSurvey (data) {
    this.context.state.client.service('command/individualAnswerSurvey').create(data).then((result) => {
    }).catch(console.error)
  }
  completeSurvey (data) {
    this.context.state.client.service('command/individualCompleteSurvey').create(data).then((response) => {
    }).catch(console.error)
  }
}

export default ReaderHelpers
