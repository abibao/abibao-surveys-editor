// react
import Reflux from 'reflux'

// libraries
import Client from './../libs/ClientAdmin'
import AdminActions from './../actions/AdminActions'
import AdminnHelpers from './../helpers/AdminHelpers'

class AdminStore extends Reflux.Store {
  constructor () {
    console.log('AdminStore', 'constructor')
    super()
    this.state = {
      client: false, // feathers client
      socket: false, // socketIO token
      token: false, // Authentification jwt
      initialized: false, // application has finish loading or not ?
      loader: {
        visible: true,
        message: 'Connexion en cours...'
      },
      campaigns: {},
      templates: []
    }
    // helpers
    this.helpers = new AdminnHelpers(this)
    // actions
    this.listenables = [AdminActions]
    // listeners
    Client((app) => {
      app.io.on('connect', () => {
        console.log('ReaderStore', 'Feathers connect')
        AdminActions.networkConnect(app)
      })
      app.io.on('disconnect', () => {
        console.log('ReaderStore', 'Feathers disconnect')
        AdminActions.networkDisconnect()
      })
      app.service('api/campaigns').on('created', (campaign) => {
        this.state.campaigns[campaign.id] = campaign
        this.setState({campaigns: this.state.campaigns})
      })
      app.service('api/campaigns').on('patched', (campaign) => {
        this.state.campaigns[campaign.id] = campaign
        this.setState({campaigns: this.state.campaigns})
      })
    })
  }
  onNetworkConnect (client) {
    console.log('AdminStore', 'onNetworkConnect')
    this.helpers.connect(client)
  }
  onNetworkDisconnect () {
    this.helpers.disconnect()
  }
  onNetworkAuthenticate (args) {
    this.helpers.authenticate(args)
  }
  onApplicationInitialize () {
    console.log('AdminStore', 'onApplicationInitialize')
    this.helpers.initialize()
  }
  onApplicationCreationComplete () {
    console.log('AdminStore', 'onApplicationCreationComplete')
    this.helpers.creationComplete()
  }
  onCampaignEmailing (params) {
    this.helpers.emailingCampaign(params)
  }
  onCampaignCreate () {
    this.helpers.createCampaign()
  }
  onCampaignUpdate (data) {
    this.helpers.updateCampaign(data)
  }
  onCampaignUpdatePicture (id, file) {
    this.helpers.updateCampaignPicture(id, file)
  }
}

module.exports = AdminStore
