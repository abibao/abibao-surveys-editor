/* global FileReader */

// libraries
import uuid from 'uuid'
import {clone, map} from 'lodash'
import Feathers from './../libs/Feathers'

// actions
import CampaignActions from './../actions/CampaignActions'

class CampaignHelpers {
  constructor (context) {
    this.context = context
  }
  emailing (params) {
    console.log('CampaignHelpers', 'emailing')
    map(params.emails, (email) => {
      Feathers.service('command/campaignCreateEmailing').create({
        email,
        url: params.url,
        campaign: params.campaign,
        template: params.template
      })
    })
  }
  read (id) {
    this.context.setState({loader: {visible: true}})
    Feathers.service('api/campaigns').get(id).then((campaign) => {
      this.context.setState({selectedCampaign: campaign, loader: {visible: false}})
    }).catch((error) => {
      this.context.setState({loader: {visible: false}})
      console.error(error)
    })
  }
  create () {
    return Feathers.service('api/campaigns').create({
      name: 'Nouvelle campagne (' + uuid.v4() + ')',
      company: 'None',
      reader: 'abibao',
      position: 0,
      picture: 'images/default/campaign.png',
      data: {pages: [{name: 'page1'}]}
    }).then((campaign) => {
    }).catch(console.error)
  }
  update (data) {
    let newData = clone(data)
    Feathers.service('api/campaigns').patch(newData.id, newData).then(() => {
    }).catch(console.error)
  }
  updatePicture (id, file) {
    this.context.setState({loader: {visible: true}})
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', () => {
      Feathers.service('uploads')
        .create({uri: reader.result})
        .then((response) => {
          this.context.setState({loader: {visible: false}})
          CampaignActions.campaignUpdate({
            id,
            picture: 'wp_content/' + response.id
          })
        }).catch((error) => {
          this.context.setState({loader: {visible: false}})
          console.error(error)
        })
    }, false)
  }
}

export default CampaignHelpers
