// react
import Reflux from 'reflux'

// libraries
import Feathers from '../libs/Feathers'

// actions
import ApplicationActions from '../actions/ApplicationActions'
import CampaignActions from '../actions/CampaignActions'
import NetworkActions from '../actions/NetworkActions'
import NotificationActions from '../actions/NotificationActions'

// helpers
import ApplicationHelpers from '../helpers/ApplicationHelpers'
import CampaignHelpers from '../helpers/CampaignHelpers'
import NetworkHelpers from '../helpers/NetworkHelpers'
import NotificationHelpers from '../helpers/NotificationHelpers'

class ApplicationStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      socket: false,
      token: false,
      initialized: false,
      loader: {
        visible: true,
        message: 'Connexion en cours...'
      },
      campaigns: {},
      entities: {},
      notifications: []
    }
    // helpers
    this.notification = new NotificationHelpers(this)
    this.network = new NetworkHelpers(this)
    this.application = new ApplicationHelpers(this)
    this.campaign = new CampaignHelpers(this)
    // actions
    this.listenables = [ApplicationActions, NetworkActions, NotificationActions, CampaignActions]
    // listeners
    Feathers.io.on('connect', () => {
      console.log('Feathers', 'onSocketConnect')
      NetworkActions.networkConnect(Feathers.io)
    })
    Feathers.io.on('disconnect', () => {
      console.log('Feathers', 'onSocketDisconnect')
      NetworkActions.networkDisconnect()
    })
    Feathers.service('api/campaigns').on('created', (campaign) => {
      campaign.company = this.state.entities[campaign.company]
      if (!campaign.company) {
        campaign.company = 'None'
      }
      this.state.campaigns[campaign.id] = campaign
      this.setState({campaigns: this.state.campaigns})
    })
    Feathers.service('api/campaigns').on('patched', (campaign) => {
      campaign.company = this.state.entities[campaign.company]
      if (!campaign.company) {
        campaign.company = 'None'
      }
      this.state.campaigns[campaign.id] = campaign
      this.setState({campaigns: this.state.campaigns})
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
  onApplicationInitialize () {
    this.application.initialize()
  }
  onApplicationCreationComplete () {
    this.application.creationComplete()
  }
  onNotificationAdd (options) {
    this.notification.add(options)
  }
  onNotificationRemove (uuid) {
    this.notification.remove(uuid)
  }
  onCampaignCreate () {
    this.campaign.create()
  }
  onCampaignUpdate (data) {
    this.campaign.campaignUpdate(data)
  }
  onCampaignUpdatePicture (id, file) {
    this.campaign.campaignUpdatePicture(id, file)
  }
}

module.exports = ApplicationStore
