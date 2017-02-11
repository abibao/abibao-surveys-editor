import Reflux from 'reflux'

import {findIndex} from 'lodash'

import Feathers from '../libs/Feathers'

const Actions = Reflux.createActions([
  'createData',
  'updateData',
  'updateDataProdiver'])

class CampaignStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      dataProviderCampaigns: {
        data: []
      }
    }
    this.listenables = Actions
    this.service = Feathers.service('api/campaigns')
    this.service.on('created', Actions.createData)
    this.service.on('patched', Actions.updateData)
  }

  /*
    ACTIONS
  */
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

  create () {
    let data = {
      name: 'Nouvelle campagne',
      data: {pages: [{name: 'page1'}]}
    }
    this.service.create(data).then(() => {
    }).catch(console.error)
  }

  /*
    EVENTS
  */
  onUpdateDataProdiver (dataProvider) {
    this.setState({dataProviderCampaigns: dataProvider})
  }

  onCreateData (item) {
    console.log('campaign created')
    let campaigns = this.state.dataProviderCampaigns
    campaigns.data.push(item)
    this.setState({dataProviderCampaigns: item})
  }

  onUpdateData (item) {
    console.log('campaign updated')
    let campaigns = this.state.dataProviderCampaigns
    let i = findIndex(campaigns.data, function (o) { return o.id === item.id })
    if (i === -1) { return false }
    campaigns.data[i] = item
    this.setState({dataProviderCampaigns: campaigns})
  }
}

module.exports = CampaignStore
