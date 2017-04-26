// react
import Reflux from 'reflux'

// libraries
import Client from './Client'
import ReaderActions from './Actions'
import ReaderHelpers from './Helpers'

class ReaderStore extends Reflux.Store {
  constructor () {
    console.log('ReaderStore', 'constructor')
    super()
    this.state = {
      client: false, // feathers client
      socket: false, // socketIO token
      token: false, // Authentification jwt
      initialized: false, // application has finish loading or not ?
      selectedCampaign: false, // campaign id to load
      askEmail: false, // reader in ask email mode
      passwordless: false, // message email sended
      selectedSurvey: false, // current survey to read
      surveys: [], // sequence of surveys to run
      loader: {
        visible: true,
        message: 'Connexion en cours...'
      }
    }
    // helpers
    this.helpers = new ReaderHelpers(this)
    // actions
    this.listenables = [ReaderActions]
    // listeners
    Client((app) => {
      app.io.on('connect', () => {
        console.log('ReaderStore', 'Feathers connect')
        ReaderActions.networkConnect(app)
      })
      app.io.on('disconnect', () => {
        console.log('ReaderStore', 'Feathers disconnect')
        ReaderActions.networkDisconnect()
      })
    })
  }
  onNetworkConnect (client) {
    console.log('ReaderStore', 'onNetworkConnect')
    this.helpers.connect(client)
  }
  onNetworkDisconnect () {
    this.helpers.disconnect()
  }
  onNetworkAuthenticate (args) {
    console.log('ReaderStore', 'onNetworkAuthenticate')
    this.helpers.authenticate(args)
  }
  onReaderInitialize () {
    console.log('ReaderStore', 'onApplicationInitialize')
    this.helpers.initialize()
  }
  onAffectSurvey (data) {
    console.log('ReaderStore', 'onAffectSurvey')
    this.helpers.affectSurvey(data)
  }
  onControlMinimum (data) {
    console.log('ReaderStore', 'onControlMinimum')
    this.helpers.controlMinimum(data)
  }
  controlSecurity (email) {
    console.log('ReaderStore', 'onSurveyControlSecurity', email)
    this.helpers.controlSecurity(email)
  }
  onAnswerSurvey (data) {
    console.log('ReaderStore', 'onAnswerSurvey')
    this.helpers.answerSurvey(data)
  }
  onCompleteSurvey () {
    console.log('ReaderStore', 'onCompleteSurvey')
    this.helpers.completeSurvey(this.state.selectedSurvey)
  }
}

module.exports = ReaderStore
