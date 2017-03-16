// react
// import {browserHistory} from 'react-router'

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
  postOnSlack (message) {
    Feathers.service('command/postOnSlackWithWebhook').create(message)
  }
  authenticate (args) {
    console.log('NetworkHelpers', 'authenticate')
    // let useStrategy = !!args.strategy
    this.context.state.loader.visible = true
    this.context.setState({loader: this.context.state.loader})
    Feathers.authenticate(args)
      .then((response) => {
        console.log('...', response)
        return Feathers.passport.verifyJWT(response.accessToken)
      })
      .then(passport => {
        console.log('...', passport)
        console.log('...', 'state.initialized', this.context.state.initialized)
        if (!this.context.state.initialized) {
          ApplicationActions.applicationInitialize()
        }
      })
      .catch((error) => {
        console.error('...', error)
        this.context.setState({token: false, loader: {visible: false}})
        // browserHistory.push('/admin/login')
      })
  }
}

export default NetworkHelpers
