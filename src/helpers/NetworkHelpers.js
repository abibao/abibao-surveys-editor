// react
import {browserHistory} from 'react-router'

// libraries
import Feathers from './../libs/Feathers'

// actions
import ApplicationActions from './../actions/ApplicationActions'
import NetworkActions from './../actions/NetworkActions'

class NetworkHelpers {
  constructor (context) {
    this.context = context
  }
  connect (socket) {
    this.context.setState({socket})
    NetworkActions.networkAuthenticate({})
  }
  disconnect () {
    this.context.setState({socket: false})
  }
  authenticate (args) {
    let useStrategy = !!args.strategy
    this.context.state.loader.visible = true
    this.context.setState({loader: this.context.state.loader})
    Feathers.authenticate(args).then((result) => {
      this.context.setState({token: result.accessToken, loader: {visible: false}})
      if (useStrategy) {
      } else {
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
