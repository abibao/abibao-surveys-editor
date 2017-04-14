// react
import Reflux from 'reflux'

// libraries
import Feathers from './../libs/Feathers'

// actions
import ApplicationActions from './../actions/ApplicationActions'
import CampaignActions from './../actions/CampaignActions'
import SurveyActions from './../actions/SurveyActions'
import NetworkActions from './../actions/NetworkActions'

// helpers
import ApplicationHelpers from './../helpers/ApplicationHelpers'
import CampaignHelpers from './../helpers/CampaignHelpers'
import SurveyHelpers from './../helpers/SurveyHelpers'
import NetworkHelpers from './../helpers/NetworkHelpers'

class AdminStore extends Reflux.Store {
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
      campaigns: {}
    }
    // helpers
    this.network = new NetworkHelpers(this)
    this.application = new ApplicationHelpers(this)
    this.campaign = new CampaignHelpers(this)
    this.survey = new SurveyHelpers(this)
    // actions
    this.listenables = [ApplicationActions, NetworkActions, CampaignActions, SurveyActions]
    // listeners
    Feathers.io.on('connect', () => {
      console.log('Feathers Admin connect')
      NetworkActions.networkConnect(Feathers.io)
    })
    Feathers.io.on('Feathers Admin disconnect', () => {
      NetworkActions.networkDisconnect()
    })
    Feathers.service('api/campaigns').on('created', (campaign) => {
      this.state.campaigns[campaign.id] = campaign
      this.setState({campaigns: this.state.campaigns})
    })
    Feathers.service('api/campaigns').on('patched', (campaign) => {
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
  onCampaignCreate () {
    this.campaign.create()
  }
  onCampaignUpdate (data) {
    this.campaign.update(data)
  }
  onCampaignUpdatePicture (id, file) {
    this.campaign.updatePicture(id, file)
  }
  onSurveyAffect (data) {
    this.survey.affect(data)
  }
}

module.exports = AdminStore
