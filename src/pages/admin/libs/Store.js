// react
import Reflux from 'reflux'

// libraries
import Client from './Client'
import AdminActions from './Actions'
import AdminnHelpers from './Helpers'

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
      templates: {
        total_rows: 0,
        rows: []
      },
      mailings: {
        total_rows: 0,
        rows: []
      }
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
    console.log('AdminStore', 'onNetworkDisconnect')
    this.helpers.disconnect()
  }
  onNetworkAuthenticate (args) {
    console.log('AdminStore', 'onNetworkAuthenticate', args)
    this.helpers.authenticate(args)
  }
  onNetworkLogout () {
    console.log('AdminStore', 'onNetworkAuthenticate')
    this.helpers.disconnect()
  }
  onApplicationInitialize () {
    console.log('AdminStore', 'onNetworkLogout')
    this.helpers.initialize()
  }
  onApplicationCreationComplete () {
    console.log('AdminStore', 'onApplicationCreationComplete')
    this.helpers.creationComplete()
  }
  onCampaignEmailing (id) {
    console.log('AdminStore', 'onCampaignEmailing')
    this.helpers.emailingCampaign(id)
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
  onMailingCreate () {
    console.log('AdminStore', 'onMailingCreate')
    this.helpers.createMailing()
  }
  onMailingUpdate (data) {
    console.log('AdminStore', 'onMailingUpdate')
    this.helpers.updateMailing(data)
  }
  onTemplatesRefresh () {
    console.log('AdminStore', 'onTemplatesRefresh')
    this.helpers.refreshTemplates()
  }
}

export default AdminStore
