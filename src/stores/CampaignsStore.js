/* global FileReader */

// react
import Reflux from 'reflux'
import {findIndex} from 'lodash'

// libraries
import Feathers from '../libs/Feathers'
import CampaignsActions from '../actions/CampaignsActions'

class CampaignsStore extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      campaigns: [],
      entities: []
    }
    this.listenables = CampaignsActions
    Feathers.service('api/campaigns').on('created', CampaignsActions.createdCampaign)
    Feathers.service('api/campaigns').on('patched', CampaignsActions.updatedCampaign)
  }

  onInitialize () {
    Feathers.service('api/campaigns').find({query: {$sort: {company: 1, position: 1, name: 1}}}).then((campaigns) => {
      this.setState({campaigns})
      return Feathers.service('api/entities').find({query: {$select: ['id', 'name']}}).then((entities) => {
        this.setState({entities})
      })
    })
    .then(() => {
      this.state.campaigns.map((campaign) => {
        return CampaignsActions.populateEntity(campaign)
      })
    })
    .catch(console.error)
  }

  onPopulateEntity (campaign) {
    let i = findIndex(this.state.entities, function (o) { return o.id === campaign.company })
    campaign.company = this.state.entities[i] || {name: 'Aucune'}
    this.setState({campaigns: this.state.campaigns})
  }

  onCreate () {
    let data = {
      name: 'Nouvelle campagne',
      picture: 'images/default/campaign.png',
      company: 'None',
      data: {pages: [{name: 'page1'}]}
    }
    Feathers.service('api/campaigns').create(data).then(() => {
    }).catch(console.error)
  }

  onCreatedCampaign (data) {
    this.state.campaigns.push(data)
    this.setState({campaigns: this.state.campaigns})
  }

  onSave (data) {
    data.company = data.company.id
    Feathers.service('api/campaigns').patch(data.id, data).then(() => {
    }).catch(console.error)
  }

  onUpdatedCampaign (data) {
    let i = findIndex(this.state.campaigns, function (o) { return o.id === data.id })
    this.state.campaigns[i] = data
    this.setState({campaigns: this.state.campaigns})
  }

  onUpload (data, filepath) {
    const reader = new FileReader()
    reader.readAsDataURL(filepath)
    reader.addEventListener('load', () => {
      Feathers.service('uploads')
        .create({uri: reader.result})
        .then((response) => {
          data.picture = 'wp_content/' + response.id
          return CampaignsActions.save(data)
        }).catch(console.error)
    }, false)
  }
}

module.exports = CampaignsStore
