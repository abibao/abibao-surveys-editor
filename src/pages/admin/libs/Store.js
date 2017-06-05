// react
import Reflux from 'reflux'

// libraries
import Client from './Client'
import AdminActions from './Actions'
import AdminnHelpers from './Helpers'

import Debug from 'debug'
const debug = Debug('abibao-platform:admin')

class AdminStore extends Reflux.Store {
  constructor () {
    debug('AdminStore', 'constructor')
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
      styles: {},
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
        debug('ReaderStore', 'Feathers connect')
        AdminActions.networkConnect(app)
      })
      app.io.on('disconnect', () => {
        debug('ReaderStore', 'Feathers disconnect')
        AdminActions.networkDisconnect()
      })
      app.service('api/styles').on('created', (style) => {
        this.state.styles[style.id] = style
        this.setState({styles: this.state.styles})
      })
      app.service('api/styles').on('patched', (style) => {
        this.state.styles[style.id] = style
        this.setState({styles: this.state.styles})
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
    debug('AdminStore', 'onNetworkConnect')
    this.helpers.connect(client)
  }
  onNetworkDisconnect () {
    debug('AdminStore', 'onNetworkDisconnect')
    this.helpers.disconnect()
  }
  onNetworkAuthenticate (args) {
    debug('AdminStore', 'onNetworkAuthenticate', args)
    this.helpers.authenticate(args)
  }
  onNetworkLogout () {
    debug('AdminStore', 'onNetworkAuthenticate')
    this.helpers.disconnect()
  }
  onApplicationInitialize () {
    debug('AdminStore', 'onNetworkLogout')
    this.helpers.initialize()
  }
  onApplicationCreationComplete () {
    debug('AdminStore', 'onApplicationCreationComplete')
    this.helpers.creationComplete()
  }
  onCampaignEmailing (id) {
    debug('AdminStore', 'onCampaignEmailing')
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
    debug('AdminStore', 'onMailingCreate')
    this.helpers.createMailing()
  }
  onMailingUpdate (data) {
    debug('AdminStore', 'onMailingUpdate')
    this.helpers.updateMailing(data)
  }
  onTemplatesRefresh () {
    debug('AdminStore', 'onTemplatesRefresh')
    this.helpers.refreshTemplates()
  }
  onStyleCreate () {
    this.helpers.createStyle()
  }
  onStyleUpdate (data) {
    this.helpers.updateStyle(data)
  }
}

export default AdminStore
