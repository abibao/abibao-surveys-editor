// react
import Reflux from 'reflux'

// libraries
import Feathers from '../libs/Feathers'

// actions
import ApplicationActions from '../actions/ApplicationActions'
import NetworkActions from '../actions/NetworkActions'
import NotificationActions from '../actions/NotificationActions'

// helpers
import ApplicationHelpers from '../helpers/ApplicationHelpers'
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
    // actions
    this.listenables = [ApplicationActions, NetworkActions, NotificationActions]
    // resolvers
    console.log(this.helpers)
    // listeners
    Feathers.io.on('connect', () => {
      console.log('Feathers', 'onSocketConnect')
      NetworkActions.networkConnect(Feathers.io)
    })
    Feathers.io.on('disconnect', () => {
      console.log('Feathers', 'onSocketDisconnect')
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
  onCreateCampaign () {
    console.log('ApplicationStore', 'onCreateCampaign')
    return Feathers.service('api/campaigns').create({}).then((campaign) => {
      ApplicationActions.addNotification({message: 'Une campagne a été ajouté.'})
    }).catch(console.error)
  }
}

module.exports = ApplicationStore
