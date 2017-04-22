/* global FileReader */

import uuid from 'uuid'
import {clone} from 'lodash'
import PouchDB from 'pouchdb'

import AdminActions from './Actions'

class AdminHelpers {
  constructor (context) {
    console.log('AdminHelpers', 'constructor')
    this.context = context
    this.dbs = {
      remoteMailings: new PouchDB('http://infra:infra@localhost:5984/mailing'),
      localMailings: new PouchDB('mailing', {auto_compaction: true})
    }
    this.dbs.localMailings.sync(this.dbs.remoteMailings, {live: true, retry: true})
      .on('change', ({direction, change}) => {
        if (direction === 'pull' && change.ok === true) {
          console.log('localDB mailings', 'on met à jour', change)
          this.dbs.localMailings.allDocs({include_docs: true}).then((docs) => {
            this.context.setState({mailings: docs})
          })
        }
      })
      .on('error', (error) => {
        console.error('...', 'local and remote databases sync failed')
        console.error(error)
      })
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
          if (!window.location.pathname.includes('admin/login')) {
            AdminActions.applicationInitialize()
          } else {
            window.location = window.location.origin + '/admin/campaigns'
          }
        }
      })
      .catch((error) => {
        console.error('...', error)
        if (error.toString().includes('NotAuthenticated')) {
          console.log('...', 'no jwt token found, now use strategy local')
          if (!window.location.pathname.includes('admin/login')) {
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
  disconnect () {
    console.log('AdminHelpers', 'disconnect')
    this.context.setState({loader: {
      visible: true,
      message: 'Déconnexion en cours...'
    }})
    window.localStorage.removeItem('rememberMe')
    window.location = window.location.origin + '/admin/login'
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
        return this
      })
      this.context.setState({templates: this.context.state.templates})
      this.context.setState({loader: {
        visible: true,
        message: 'Synchronisation des data en cours...'
      }})
      AdminActions.applicationCreationComplete()
      // databases real time
      this.dbs.localMailings.allDocs({include_docs: true}).then((docs) => {
        this.context.setState({mailings: docs})
      }).catch((error) => {
        console.error(error)
      })
    }).catch((error) => {
      console.error(error)
      this.context.setState({token: false, loader: {visible: true, message: error.toString()}})
      if (!window.location.pathname.includes('admin/login')) {
        window.localStorage.removeItem('rememberMe')
        // window.location = window.location.origin + '/admin/login'
      }
    })
  }
  creationComplete () {
    console.log('AdminHelpers', 'creationComplete')
    this.context.setState({initialized: true, loader: {visible: false}, campaigns: this.context.state.campaigns})
  }
  emailingCampaign (params) {
    console.log('AdminHelpers', 'emailingCampaign')
    params.emails.map((email) => {
      this.context.state.client.service('command/campaignCreateEmailing').create({
        email,
        url: params.url,
        campaign: params.campaign,
        template: params.template,
        categories: params.categories
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
