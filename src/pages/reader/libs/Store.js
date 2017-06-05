// react
import Reflux from 'reflux'

// libraries
import Client from './Client'
import ReaderActions from './Actions'
import ReaderHelpers from './Helpers'

import Debug from 'debug'
const debug = Debug('abibao-platform:reader')

class ReaderStore extends Reflux.Store {
  constructor () {
    debug('ReaderStore', 'constructor')
    super()
    this.state = {
      client: false, // feathers client
      socket: false, // socketIO token
      token: false, // Authentification jwt
      initialized: false, // application has finish loading or not ?
      selectedCampaign: false, // campaign id to load
      screenComplete: false,
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
        debug('ReaderStore', 'Feathers connect')
        ReaderActions.networkConnect(app)
      })
      app.io.on('disconnect', () => {
        debug('ReaderStore', 'Feathers disconnect')
        ReaderActions.networkDisconnect()
      })
    })
  }
  onNetworkConnect (client) {
    debug('ReaderStore', 'onNetworkConnect')
    this.helpers.connect(client)
  }
  onNetworkDisconnect () {
    this.helpers.disconnect()
  }
  onNetworkAuthenticate (args) {
    debug('ReaderStore', 'onNetworkAuthenticate')
    this.helpers.authenticate(args)
  }
  onReaderInitialize () {
    debug('ReaderStore', 'onApplicationInitialize')
    this.helpers.initialize()
  }
  onAffectSurvey (data) {
    debug('ReaderStore', 'onAffectSurvey')
    this.helpers.affectSurvey(data)
  }
  onControlMinimum (data) {
    debug('ReaderStore', 'onControlMinimum')
    this.helpers.controlMinimum(data)
  }
  controlSecurity (email, campaign) {
    debug('ReaderStore', 'onSurveyControlSecurity', email)
    this.helpers.controlSecurity(email, campaign)
  }
  onAnswerSurvey (data) {
    debug('ReaderStore', 'onAnswerSurvey')
    this.helpers.answerSurvey(data)
  }
  onCompleteSurvey () {
    debug('ReaderStore', 'onCompleteSurvey')
    this.helpers.completeSurvey(this.state.selectedSurvey)
  }
  onGetScreenComplete (id) {
    debug('ReaderStore', 'onGetScreenComplete')
    this.helpers.getScreenComplete(id)
  }
}

export default ReaderStore
