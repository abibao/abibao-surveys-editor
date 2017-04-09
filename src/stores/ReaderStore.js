// react
import Reflux from 'reflux'

// libraries
import Feathers from './../libs/Feathers'

// actions
import NetworkActions from './../actions/NetworkActions'
import CampaignActions from './../actions/CampaignActions'
import AnswerActions from './../actions/AnswerActions'
import SurveyActions from './../actions/SurveyActions'

// helpers
import NetworkHelpers from './../helpers/NetworkHelpers'
import CampaignHelpers from './../helpers/CampaignHelpers'
import AnswerHelpers from './../helpers/AnswerHelpers'
import SurveyHelpers from './../helpers/SurveyHelpers'

class ReaderStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      reader: true,
      socket: false,
      token: false,
      initialized: false,
      askEmail: false,
      passwordless: false,
      selectedSurvey: false,
      selectedCampaign: false,
      loader: {
        visible: true,
        message: 'Connexion en cours...'
      }
    }
    // helpers
    this.network = new NetworkHelpers(this)
    this.campaign = new CampaignHelpers(this)
    this.answer = new AnswerHelpers(this)
    this.survey = new SurveyHelpers(this)
    // actions
    this.listenables = [NetworkActions, CampaignActions, AnswerActions, SurveyActions]
    // listeners
    Feathers.io.on('connect', () => {
      console.log('Feathers Reader connect')
      NetworkActions.networkConnect(Feathers.io)
    })
    Feathers.io.on('Feathers Reader disconnect', () => {
      NetworkActions.networkDisconnect()
    })
  }
  onNetworkConnect (socket) {
    this.network.connect(socket)
  }
  onNetworkDisconnect () {
    this.network.disconnect()
  }
  onNetworkAuthenticate (args) {
    this.network.authenticate(args)
  }
  onNetworkPostOnSlack (message) {
    this.network.postOnSlack(message)
  }
  onAnswerUpsert (data) {
    console.log('ReaderStore', 'onAnswerUpsert')
    this.answer.upsert(data)
  }
  onSurveyComplete () {
    console.log('ReaderStore', 'onSurveyComplete')
    this.survey.complete(this.state.selectedSurvey)
  }
  onSurveyAffect (data) {
    console.log('ReaderStore', 'onSurveyAffect')
    this.survey.affect(data)
  }
  onSurveyAbibaoAffectPosition1 (email) {
    console.log('ReaderStore', 'onSurveyAbibaoAffectPosition1', email)
    this.survey.affectAbibaoPosition1(email)
  }
}

module.exports = ReaderStore
