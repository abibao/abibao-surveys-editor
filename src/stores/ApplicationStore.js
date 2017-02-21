// react
import Reflux from 'reflux'
import uuid from 'uuid'
import {browserHistory} from 'react-router'

// libraries
import Feathers from '../libs/Feathers'

// actions
import ApplicationActions from '../actions/ApplicationActions'
import NetworkActions from '../actions/NetworkActions'

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
    this.listenables = [ApplicationActions, NetworkActions]
    Feathers.io.on('connect', () => {
      console.log('Feathers', 'onSocketConnect')
      NetworkActions.socketConnect(Feathers.io)
    })
    Feathers.io.on('disconnect', () => {
      console.log('Feathers', 'onSocketDisconnect')
      NetworkActions.socketDisconnect()
    })
  }
  onSocketConnect (socket) {
    console.log('ApplicationStore', 'onSocketConnect')
    this.setState({socket})
    ApplicationActions.addNotification({message: 'socket connected '})
    NetworkActions.authenticate({})
  }
  onSocketDisconnect () {
    console.log('ApplicationStore', 'onSocketDisconnect')
    this.setState({socket: false})
    ApplicationActions.addNotification({message: 'socket disconnected '})
  }
  onAuthenticate (args) {
    let useStrategy = !!args.strategy
    console.log('ApplicationStore', 'onAuthenticate useStrategy=', useStrategy)
    Feathers.authenticate(args).then((result) => {
      this.setState({token: result.accessToken})
      if (useStrategy) {
        ApplicationActions.addNotification({message: 'client logged'})
      } else {
        ApplicationActions.addNotification({message: 'client authenticated'})
      }
      if (!this.state.initialized) {
        ApplicationActions.initialize()
      }
    }).catch((error) => {
      console.error('...', error)
      this.setState({token: false, loader: {visible: false}})
      browserHistory.push('/admin/login')
    })
  }
  onInitialize () {
    console.log('ApplicationStore', 'onInitialize')
    this.setState({loader: {visible: true, message: 'Chargement...'}})
    return Feathers.service('api/campaigns').find().then((campaigns) => {
      let dictionnary = {}
      campaigns.map((campaign) => {
        dictionnary[campaign.id] = campaign
        return true
      })
      this.setState({campaigns: dictionnary})
      ApplicationActions.addNotification({message: 'campaigns loaded '})
      return Feathers.service('api/entities').find().then((entities) => {
        let dictionnary = {}
        entities.map((entity) => {
          dictionnary[entity.id] = entity
          return true
        })
        this.setState({entities: dictionnary})
        ApplicationActions.addNotification({message: 'entities loaded '})
        // on complete then ...
        ApplicationActions.creationComplete()
      })
    }).catch(console.error)
  }
  onCreationComplete () {
    console.log('ApplicationStore', 'onCreationComplete')
    // populate campaigns
    Object.keys(this.state.campaigns).map((key) => {
      let val = this.state.campaigns[key].company
      this.state.campaigns[key].company = this.state.entities[val] || {name: 'Aucune'}
      return true
    })
    console.log(this.state.campaigns)
    this.setState({initialized: true, loader: {visible: false}, campaigns: this.state.campaigns})
  }
  onAddNotification (options) {
    const key = uuid.v4()
    this.state.notifications.push({
      message: options.message,
      key,
      action: 'Fermer',
      dismissAfter: options.dismissAfter || 1500,
      onClick: () => ApplicationActions.removeNotification(key)
    })
    this.setState({notifications: this.state.notifications})
  }
  onRemoveNotification (uuid) {
    const {notifications} = this.state
    this.setState({
      notifications: notifications.filter(n => n.key !== uuid)
    })
  }
}

module.exports = ApplicationStore
