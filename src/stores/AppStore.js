import Reflux from 'reflux'

import {browserHistory} from 'react-router'

import Feathers from '../libs/Feathers'

const Actions = Reflux.createActions([
  'networkOnline'])

class AppStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      accessToken: null,
      networkOnline: false,
      socket: null
    }
    Feathers.io.on('connect', () => {
      Actions.networkOnline(Feathers.io)
    })
    Feathers.io.on('disconnect', () => {
      Actions.networkOnline(Feathers.io)
    })
    this.listenables = Actions
  }

  /*
    ACTIONS
  */
  login (params) {
    Feathers.authenticate({
      strategy: 'local',
      email: params.email,
      password: params.password
    }).then((result) => {
      this.setState({accessToken: result.accessToken})
      browserHistory.push('/')
    }).catch(error => {
      console.log(error)
      this.setState({accessToken: null})
    })
  }

  logout () {
    Feathers.logout()
    browserHistory.push('/')
  }

  checkUser (callback) {
    console.log(callback)
    Feathers.authenticate().then((result) => {
      if (callback) { return callback(null, result.accessToken) }
      this.setState({accessToken: result.accessToken})
    }).catch(error => {
      if (callback) { return callback(error, null) }
      this.setState({accessToken: null})
    })
  }

  /*
    EVENTS
  */
  onNetworkOnline (socket) {
    this.setState({networkOnline: socket.connected, socket: socket.id})
  }
}

module.exports = AppStore
