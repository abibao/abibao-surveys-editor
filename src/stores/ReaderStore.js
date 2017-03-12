// react
import Reflux from 'reflux'

// libraries
import Feathers from './../libs/Feathers'

// actions
import NetworkActions from './../actions/NetworkActions'
import CampaignActions from './../actions/CampaignActions'

// helpers
import NetworkHelpers from './../helpers/NetworkHelpers'
import CampaignHelpers from './../helpers/CampaignHelpers'

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
    // actions
    this.listenables = [NetworkActions, CampaignActions]
    // listeners
    Feathers.io.on('connect', () => {
      console.log('Feathers Reader connect')
      NetworkActions.networkConnect(Feathers.io)
      NetworkActions.networkAuthenticate({strategy: 'local', email: 'application@abibao.com', password: 'password'})
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
  onCampaignRead (id) {
    this.campaign.read(id)
  }
}

module.exports = ReaderStore
