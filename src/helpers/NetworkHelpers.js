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
    this.context.state.loader.visible = true
    this.context.setState({loader: this.context.state.loader})
    Feathers.authenticate(args)
      .then((response) => {
        console.log('...', 'response')
        this.context.state.token = response.accessToken
        return Feathers.passport.verifyJWT(response.accessToken)
      })
      .then(passport => {
        console.log('...', 'passport')
        console.log('...', 'state.initialized', this.context.state.initialized)
        if (this.context.state.reader === true) {
          console.log('...', this.context.state.token)
          this.context.setState({initialized: true, token: this.context.state.token})
        } else {
          if (!this.context.state.initialized) {
            ApplicationActions.applicationInitialize()
          }
        }
      })
      .catch((error) => {
        console.error('...', error.toString())
        if (error.toString().includes('NotAuthenticated')) {
          console.log('...', 'time to connect auto if client')
          if (this.context.state.reader === true) {
            NetworkActions.networkAuthenticate({strategy: 'local', email: 'reader@abibao.com', password: 'password'})
          }
        }
        this.context.setState({token: false, loader: {visible: false}})
      })
  }
}

export default NetworkHelpers
