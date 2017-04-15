// libraries
import Feathers from './../libs/Feathers'

// actions
import ReaderActions from './../actions/ReaderActions'
import ApplicationActions from './../actions/ApplicationActions'
import NetworkActions from './../actions/NetworkActions'

class NetworkHelpers {
  constructor (context) {
    this.context = context
  }
  connect (socket) {
    console.log('NetworkHelpers', 'connect')
    this.context.setState({
      socket,
      loader: {
        visible: true,
        message: 'Connexion acceptée...'
      }
    })
    NetworkActions.networkAuthenticate({})
  }
  disconnect () {
    this.context.setState({socket: false})
  }
  postOnSlack (message) {
    Feathers.service('command/postOnSlackWithWebhook').create(message)
  }
  authenticate (args) {
    console.log('NetworkHelpers', 'authenticate', args)
    Feathers.authenticate(args)
      .then((response) => {
        this.context.setState({loader: {
          visible: true,
          message: 'Authentification acceptée...'
        }})
        console.log('...', 'response')
        this.context.setState({token: response.accessToken})
        return Feathers.passport.verifyJWT(response.accessToken)
      })
      .then(passport => {
        console.log('...', 'passport')
        console.log('...', 'state.initialized', this.context.state.initialized)
        ApplicationActions.applicationInitialize()
        ReaderActions.readerInitialize()
      })
      .catch((error) => {
        console.error('...', error.toString())
        if (error.toString().includes('NotAuthenticated')) {
          console.log('...', 'no jwt token found, now use strategy local')
          this.context.setState({loader: {
            visible: true,
            message: 'Authentification en cours...'
          }})
          // this.context.setState({loader: {visible: false, message: ''}})
          NetworkActions.networkAuthenticate({strategy: 'local', email: 'reader@abibao.com', password: 'password'})
        }
      })
  }
}

export default NetworkHelpers
