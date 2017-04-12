// react
import Reflux from 'reflux'

// libraries
import Feathers from './../libs/Feathers'

// actions
import ReaderActions from './../actions/ReaderActions'
import NetworkActions from './../actions/NetworkActions'
import AnswerActions from './../actions/AnswerActions'
import SurveyActions from './../actions/SurveyActions'

// helpers
import ReaderHelpers from './../helpers/ReaderHelpers'
import NetworkHelpers from './../helpers/NetworkHelpers'
import AnswerHelpers from './../helpers/AnswerHelpers'
import SurveyHelpers from './../helpers/SurveyHelpers'

class ReaderStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      // reader: true,
      socket: false, // socketIO token
      token: false, // Authentification jwt
      initialized: false, // application has finish loading or not ?
      selectedCampaign: false, // campaign id to load
      askEmail: false, // reader in ask email mode
      passwordless: false, // message email sended
      // selectedSurvey: false,
      // selectedCampaign: false,
      loader: {
        visible: true,
        message: 'Connexion en cours...'
      }
    }
    // helpers
    this.reader = new ReaderHelpers(this)
    this.network = new NetworkHelpers(this)
    this.answer = new AnswerHelpers(this)
    this.survey = new SurveyHelpers(this)
    // actions
    this.listenables = [NetworkActions, ReaderActions, AnswerActions, SurveyActions]
    // listeners
    Feathers.io.on('connect', () => {
      console.log('ReaderStore', 'Feathers connect')
      NetworkActions.networkConnect(Feathers.io)
    })
    Feathers.io.on('ReaderStore', 'Feathers disconnect', () => {
      NetworkActions.networkDisconnect()
    })
  }
  onNetworkConnect (socket) {
    console.log('ReaderStore', 'onNetworkConnect')
    this.network.connect(socket)
  }
  onNetworkAuthenticate (args) {
    console.log('ReaderStore', 'onNetworkAuthenticate')
    this.network.authenticate(args)
  }
  onReaderInitialize () {
    console.log('ReaderStore', 'onApplicationInitialize')
    this.reader.initialize()
  }
  onSurveyAffect (data) {
    console.log('ReaderStore', 'onSurveyAffect')
    this.survey.affect(data)
  }
  onSurveyControlSecurity (email) {
    console.log('ReaderStore', 'onSurveyControlSecurity', email)
    this.survey.controlSecurity(email)
  }
  onAnswerUpsert (data) {
    console.log('ReaderStore', 'onAnswerUpsert')
    this.answer.upsert(data)
  }
  onSurveyComplete () {
    console.log('ReaderStore', 'onSurveyComplete')
    this.survey.complete(this.state.selectedSurvey)
  }
  /*
  onNetworkDisconnect () {
    this.network.disconnect()
  }
  onNetworkPostOnSlack (message) {
    this.network.postOnSlack(message)
  }
  */
}

module.exports = ReaderStore
