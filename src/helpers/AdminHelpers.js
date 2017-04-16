/* global FileReader */

import AdminActions from './../actions/AdminActions'
import uuid from 'uuid'
import {clone} from 'lodash'

class AdminHelpers {
  constructor (context) {
    console.log('AdminHelpers', 'constructor')
    this.context = context
  }
  connect (client) {
    console.log('AdminHelpers', 'connect', client.io.id)
    this.context.setState({
      client,
      socket: client.io.id,
      loader: {
        visible: true,
        message: 'Connexion acceptée...'
      }
    })
    this.authenticate()
  }
  authenticate (args) {
    console.log('AdminHelpers', 'authenticate')
    this.context.state.client.authenticate(args)
      .then((response) => {
        this.context.setState({loader: {
          visible: true,
          message: 'Authentification acceptée...'
        }})
        console.log('...', 'response')
        this.context.setState({token: response.accessToken})
        return this.context.state.client.passport.verifyJWT(response.accessToken)
      })
      .then(passport => {
        let timestamp = Date.now() / 1000
        console.log('...', 'passport', passport.exp - timestamp)
        console.log('...', 'state.initialized', this.context.state.initialized)
        if (passport.exp < Date.now() / 1000) {
          window.location = window.location.origin + '/admin/login'
        } else {
          if (window.location.pathname !== '/admin/login') {
            AdminActions.applicationInitialize()
          } else {
            window.location = window.location.origin + '/admin/campaigns'
          }
        }
      })
      .catch((error) => {
        console.error('...', error.toString())
        if (error.toString().includes('NotAuthenticated')) {
          console.log('...', 'no jwt token found, now use strategy local')
          if (window.location.pathname !== '/admin/login') {
            window.location = window.location.origin + '/admin/login'
          } else {
            this.context.setState({
              initialized: false,
              loader: {
                visible: false,
                message: ''
              }
            })
          }
        }
      })
  }
  initialize () {
    console.log('AdminHelpers', 'initialize')
    this.context.setState({loader: {
      visible: true,
      message: 'Chargement des data en cours...'
    }})
    this.context.state.client.service('api/campaigns').find({
      query: {
        $sort: {company: 1, position: 1}
      }
    }).then((campaigns) => {
      let dictionnary = {}
      campaigns.map((campaign) => {
        dictionnary[campaign.id] = campaign
        return this
      })
      this.context.setState({campaigns: dictionnary})
      return this.context.state.client.service('query/sendgridGetAllTemplates').find()
    }).then((result) => {
      result.templates.map((template) => {
        this.context.state.templates.push({
          key: template.id,
          text: template.name,
          value: template.id
        })
        /* template.versions.map((version) => {
          this.context.state.templates.push({
            key: version.id,
            text: version.name,
            value: version.id
          })
          return this
        }) */
        return this
      })
      this.context.setState({templates: this.context.state.templates})
      AdminActions.applicationCreationComplete()
    }).catch((error) => {
      console.error(error)
      this.context.setState({token: false, loader: {visible: false}})
    })
  }
  creationComplete () {
    console.log('AdminHelpers', 'creationComplete')
    this.context.setState({initialized: true, loader: {visible: false}, campaigns: this.context.state.campaigns})
  }
  emailingCampaign (params) {
    console.log('AdminHelpers', 'emailing')
    params.emails.map((email) => {
      this.context.state.client.service('command/campaignCreateEmailing').create({
        email,
        url: params.url,
        campaign: params.campaign,
        template: params.template
      })
      return this
    })
  }
  createCampaign () {
    console.log('AdminHelpers', 'createCampaign')
    return this.context.state.client.service('api/campaigns').create({
      name: 'Nouvelle campagne (' + uuid.v4() + ')',
      company: 'None',
      reader: 'abibao',
      position: 0,
      picture: 'images/default/campaign.png',
      data: {pages: [{name: 'page1'}]}
    }).then((campaign) => {
    }).catch(console.error)
  }
  updateCampaign (data) {
    console.log('AdminHelpers', 'updateCampaign')
    let newData = clone(data)
    this.context.state.client.service('api/campaigns').patch(newData.id, newData).then(() => {
    }).catch(console.error)
  }
  updateCampaignPicture (id, file) {
    console.log('AdminHelpers', 'updateCampaignPicture')
    this.context.setState({loader: {visible: true}})
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener('load', () => {
      this.context.state.client.service('uploads')
        .create({uri: reader.result})
        .then((response) => {
          this.context.setState({loader: {visible: false}})
          AdminActions.campaignUpdate({
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

export default AdminHelpers
