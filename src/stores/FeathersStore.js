import Reflux from 'reflux'

import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import hooks from 'feathers-hooks'
import auth from 'feathers-authentication-client'
import io from 'socket.io-client'

const Actions = Reflux.createActions(['connected', 'disconnected', 'surveyCreated', 'surveysLoaded'])

class FeathersStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      connected: false,
      socket: null
    }
    this.listenables = Actions
    // feathers
    const host = 'http://localhost:8000'
    const socket = io(host)
    this.app = feathers()
      .configure(hooks())
      .configure(socketio(socket))
      .configure(auth({
        storage: window.localStorage,
        storageKey: 'rememberMe',
        cookie: 'rememberMe'
      }))
    this.app.io.on('connect', () => {
      Actions.connected(this.app.io.id)
      this.getListSurveys()
    })
    this.app.io.on('disconnect', () => {
      Actions.disconnected()
    })
  }

  getListSurveys () {
    console.log('store, get all surveys')
    this.app.service('api/surveys').find({}).then((result) => {
      Actions.surveysLoaded(result)
    }).catch(console.error)
  }

  createSurvey () {
    console.log('store, create a survey')
    this.app.service('api/surveys').create({
      name: 'This is a new survey',
      data: {}
    }).then((result) => {
      this.getListSurveys()
      Actions.surveyCreated()
    }).catch(console.error)
  }

  onSurveyCreated () {
    console.log('action, create a survey')
  }

  onSurveysLoaded (data) {
    console.log('action, get all surveys')
    this.setState({surveys: data})
  }

  onConnected (id) {
    this.setState({connected: true, socket: id})
  }

  onDisconnected () {
    this.setState({connected: false, socket: null})
  }
}

export default FeathersStore
