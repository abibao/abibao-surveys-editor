/* global FileReader */

// react
import Reflux from 'reflux'

// libraries
import Feathers from '../libs/Feathers'
import EntitiesActions from '../actions/EntitiesActions'

class EntitiesStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      entities: []
    }
    this.listenables = EntitiesActions
    // this.uploadService = Feathers.service('uploads')
    // this.service = Feathers.service('api/entities')
    // this.service.on('patched', Actions.updateData)
    // this.find()
  }

  onInitialize () {
    Feathers.service('api/entities').find({query: {$sort: {name: 1}}}).then((entities) => {
      this.setState({entities})
    })
    .catch(console.error)
  }
}

module.exports = EntitiesStore
