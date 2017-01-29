import Reflux from 'reflux'

import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import hooks from 'feathers-hooks'
import auth from 'feathers-authentication-client'
import io from 'socket.io-client'

const Actions = Reflux.createActions([
  'connected',
  'disconnected',
  'surveyCreated',
  'surveyUpdated',
  'surveysLoaded'])

class FeathersStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      connected: false,
      socket: null,
      surveys: {
        total: 0,
        data: []
      }
    }
    this.listenables = Actions
    // feathers
    const host = process.env.REACT_APP_IO_HOST
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
      data: {pages: [{name: 'page1'}]}
    }).then((result) => {
      this.getListSurveys()
      Actions.surveyCreated()
    }).catch(console.error)
  }

  updateSurvey (data) {
    console.log('store, update a survey')
    this.app.service('api/surveys').update(data.id, data).then((result) => {
      this.getListSurveys()
      Actions.surveyUpdated()
    }).catch(console.error)
  }

  onSurveyUpdated () {
    console.log('action, update a survey')
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
