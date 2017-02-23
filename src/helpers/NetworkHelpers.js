// react
import {browserHistory} from 'react-router'

// libraries
import Feathers from '../libs/Feathers'

// actions
import ApplicationActions from '../actions/ApplicationActions'
import NetworkActions from '../actions/NetworkActions'
import NotificationActions from '../actions/NotificationActions'

class NetworkHelpers {
  constructor (context) {
    this.context = context
  }
  connect (socket) {
    console.log('NetworkHelpers', 'onConnect')
    this.context.setState({socket})
    NotificationActions.notificationAdd({message: 'socket connected '})
    NetworkActions.networkAuthenticate({})
  }
  disconnect () {
    console.log('NetworkHelpers', 'onDisconnect')
    this.context.setState({socket: false})
    NotificationActions.notificationAdd({message: 'socket disconnected '})
  }
  authenticate (args) {
    let useStrategy = !!args.strategy
    console.log('NetworkHelpers', 'onAuthenticate useStrategy=', useStrategy)
    Feathers.authenticate(args).then((result) => {
      this.context.setState({token: result.accessToken})
      if (useStrategy) {
        NotificationActions.notificationAdd({message: 'client logged'})
      } else {
        NotificationActions.notificationAdd({message: 'client authenticated'})
      }
      if (!this.context.state.initialized) {
        ApplicationActions.applicationInitialize()
      }
    }).catch((error) => {
      console.error('...', error)
      this.context.setState({token: false, loader: {visible: false}})
      browserHistory.push('/admin/login')
    })
  }
}

export default NetworkHelpers
