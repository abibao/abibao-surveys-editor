// react
import Reflux from 'reflux'

// libraries
import Feathers from './../libs/Feathers'

// actions
import NetworkActions from './../actions/NetworkActions'
import CampaignActions from './../actions/CampaignActions'
import AnswerActions from './../actions/AnswerActions'

// helpers
import NetworkHelpers from './../helpers/NetworkHelpers'
import CampaignHelpers from './../helpers/CampaignHelpers'
import AnswerHelpers from './../helpers/AnswerHelpers'

class ReaderStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      socket: false,
      token: false,
      initialized: false,
      loader: {
        visible: true,
        message: 'Connexion en cours...'
      }
    }
    // helpers
    this.network = new NetworkHelpers(this)
    this.campaign = new CampaignHelpers(this)
    this.answer = new AnswerHelpers(this)
    // actions
    this.listenables = [NetworkActions, CampaignActions, AnswerActions]
    // listeners
    Feathers.io.on('connect', () => {
      console.log('Feathers Reader connect')
      NetworkActions.networkConnect(Feathers.io)
      NetworkActions.networkAuthenticate({strategy: 'local', email: 'reader@abibao.com', password: 'password'})
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
}

module.exports = ReaderStore
