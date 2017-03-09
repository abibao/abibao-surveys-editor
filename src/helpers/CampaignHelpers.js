/* global FileReader */

// libraries
import uuid from 'uuid'
import {clone} from 'lodash'
import Feathers from './../libs/Feathers'

// actions
import CampaignActions from './../actions/CampaignActions'

class CampaignHelpers {
  constructor (context) {
    this.context = context
  }
  create () {
    return Feathers.service('api/campaigns').create({
      name: 'Nouvelle campagne (' + uuid.v4() + ')',
      company: 'None',
      position: 0,
      picture: 'images/default/campaign.png',
      data: {pages: [{name: 'page1'}]}
    }).then((campaign) => {
    }).catch(console.error)
  }
  campaignUpdate (data) {
    let newData = clone(data)
    if (newData.company && newData.company.name) {
      newData.company = newData.company.id
    }
    Feathers.service('api/campaigns').patch(newData.id, newData).then(() => {
    }).catch(console.error)
  }
  campaignUpdatePicture (id, file) {
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
