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
      position: 0,
      picture: 'images/default/campaign.png',
      data: {pages: [{name: 'page1'}]}
    }).then((campaign) => {
    }).catch(console.error)
  }
  update (data) {
    let newData = clone(data)
    if (newData.company && newData.company.name) {
      newData.company = newData.company.id
    }
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
          CampaignActions.update({
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
