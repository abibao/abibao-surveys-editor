/* global FileReader */
import Reflux from 'reflux'

import {findIndex} from 'lodash'

import Feathers from '../libs/Feathers'

const Actions = Reflux.createActions([
  'updateData',
  'updateDataProdiver'])

class EntityStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      initialized: false,
      dataProviderEntities: []
    }
    this.listenables = Actions
    this.uploadService = Feathers.service('uploads')
    this.service = Feathers.service('api/entities')
    this.service.on('patched', Actions.updateData)
    this.find()
    this.setState({initialized: true})
  }

  /*
    ACTIONS
  */
  upload (id, filepath) {
    const reader = new FileReader()
    reader.readAsDataURL(filepath)
    reader.addEventListener('load', () => {
      this.uploadService
        .create({uri: reader.result})
        .then((response) => {
          this.update({
            id,
            picture: 'wp_content/' + response.id
          })
        }).catch(console.error)
    }, false)
  }

  find (params = {}) {
    this.service.find(params).then((result) => {
      let dataProvider = []
      if (result !== null) {
        dataProvider = result
      }
      Actions.updateDataProdiver(dataProvider)
    }).catch(console.error)
  }

  update (data) {
    this.service.patch(data.id, data).then(() => {
    }).catch(console.error)
  }

  /*
    EVENTS
  */
  onUpdateDataProdiver (dataProvider) {
    console.log('EntityStore', 'onUpdateDataProdiver')
    this.setState({dataProviderEntities: dataProvider})
  }

  onUpdateData (item) {
    let campaigns = this.state.dataProviderEntities
    let i = findIndex(campaigns.data, function (o) { return o.id === item.id })
    if (i === -1) { return false }
    campaigns.data[i] = item
    this.setState({dataProviderCampaigns: campaigns})
  }
}

module.exports = EntityStore
