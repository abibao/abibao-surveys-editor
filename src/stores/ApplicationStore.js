// react
import Reflux from 'reflux'
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
      loader: {
        visible: true,
        message: 'Connexion en cours...'
      },
      snack: {
        open: false,
        message: ''
      }
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
  onCloseErrorMessage () {
    console.log('ApplicationStore', 'onCloseErrorMessage')
    this.setState({snack: {open: false, message: ''}})
  }
  onSocketConnect (socket) {
    console.log('ApplicationStore', 'onSocketConnect')
    this.setState({socket, snack: {open: true, message: 'socket connected'}})
    NetworkActions.authenticate({})
  }
  onSocketDisconnect () {
    console.log('ApplicationStore', 'onSocketDisconnect')
    this.setState({socket: false, snack: {open: true, message: 'socket disconnected'}})
  }
  onAuthenticate (args) {
    console.log('ApplicationStore', 'onAuthenticate')
    Feathers.authenticate(args).then((result) => {
      this.setState({token: result.accessToken, snack: {open: true, message: 'client authenticated'}, loader: {visible: false}})
      browserHistory.push('/')
    }).catch((error) => {
      console.error('...', error)
      this.setState({token: false, loader: {visible: false}})
      browserHistory.push('/admin/login')
    })
  }
}

module.exports = ApplicationStore
