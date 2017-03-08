/* global FileReader */

// libraries
import uuid from 'uuid'
import {clone} from 'lodash'
import Feathers from './../libs/Feathers'

// actions
import CampaignActions from './../actions/CampaignActions'
import NotificationActions from './../actions/NotificationActions'

class CampaignHelpers {
  constructor (context) {
    this.context = context
  }
  create () {
    console.log('CampaignHelpers', 'create')
    return Feathers.service('api/campaigns').create({
      name: 'Nouvelle campagne (' + uuid.v4() + ')',
      company: 'None',
      position: 0,
      picture: 'images/default/campaign.png',
      data: {pages: [{name: 'page1'}]}
    }).then((campaign) => {
      NotificationActions.notificationAdd({message: 'Une campagne a été ajouté.'})
    }).catch(console.error)
  }
  campaignUpdate (data) {
    console.log('CampaignHelpers', 'campaignUpdate')
    let newData = clone(data)
    if (newData.company && newData.company.name) {
      newData.company = newData.company.id
    }
    Feathers.service('api/campaigns').patch(newData.id, newData).then(() => {
      NotificationActions.notificationAdd({message: 'Une campagne a été modifé.'})
    }).catch(console.error)
  }
  campaignUpdatePicture (id, file) {
    console.log('CampaignHelpers', 'campaignUpdatePicture')
    this.context.setState({loader: {visible: true}})
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', () => {
      Feathers.service('uploads')
        .create({uri: reader.result})
        .then((response) => {
          this.context.setState({loader: {visible: false}})
          NotificationActions.notificationAdd({message: 'Image sur le serveur'})
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
