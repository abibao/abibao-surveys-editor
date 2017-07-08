/* global FileReader */

import uuid from 'uuid'
import {clone} from 'lodash'
import PouchDB from 'pouchdb'
import cookie from 'react-cookies'

import AdminActions from './Actions'
import Config from './Config'

import Debug from 'debug'
const debug = Debug('abibao-platform:admin')
const debugerror = Debug('abibao-platform:error')

class AdminHelpers {
  constructor (context) {
    debug('AdminHelpers', 'constructor')
    this.context = context
    this.dbs = {
      templates: {
        remote: new PouchDB(Config.hosts.couchdb + '/templates'),
        local: new PouchDB('templates', {auto_compaction: true})
      },
      mailings: {
        remote: new PouchDB(Config.hosts.couchdb + '/mailings'),
        local: new PouchDB('mailings', {auto_compaction: true})
      }
    }
    this.dbs.templates.local.sync(this.dbs.templates.remote, {live: true, retry: true})
      .on('change', ({direction, change}) => {
        if (change.ok === true) {
          debug('templates.local', 'change', direction)
          this.dbs.templates.local.allDocs({include_docs: true}).then((docs) => {
            this.context.setState({templates: docs})
          })
        }
      })
      .on('error', (error) => {
        debugerror('...', 'local and remote templates sync failed')
        debugerror(error)
      })
    this.dbs.mailings.local.sync(this.dbs.mailings.remote, {live: true, retry: true})
      .on('change', ({direction, change}) => {
        if (change.ok === true) {
          debug('mailings.local', 'change', direction)
          this.dbs.mailings.local.allDocs({include_docs: true}).then((docs) => {
            console.log(docs)
            this.context.setState({mailings: docs})
          })
        }
      })
      .on('error', (error) => {
        debugerror('...', 'local and remote mailings sync failed')
        debugerror(error)
      })
  }
  connect (client) {
    debug('AdminHelpers', 'client.io.id', client.io.id)
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
    debug('AdminHelpers', 'authenticate', args)
    this.context.state.client.authenticate(args)
      .then((response) => {
        this.context.setState({loader: {
          visible: true,
          message: 'Authentification acceptée...'
        }})
        debug('...', 'token', response.accessToken)
        this.context.setState({token: response.accessToken})
        return this.context.state.client.passport.verifyJWT(response.accessToken)
      })
      .then(payload => {
        debug('...', 'jwt payload', payload)
        return this.context.state.client.service('users').get(payload.userId)
      })
      .then(user => {
        this.context.state.client.set('user', user)
        debug('...', 'user', this.context.state.client.get('user'))
        this.context.setState({currentUser: user})
        return true
      })
      .then(() => {
        debug('...', 'state.initialized', this.context.state.initialized)
        if (!window.location.pathname.includes('admin/login')) {
          AdminActions.applicationInitialize()
        } else {
          window.location = window.location.origin + '/admin/campaigns'
        }
      })
      .catch((error) => {
        debugerror('...', error)
        if (error.name === 'Forbidden') {
          return AdminActions.networkLogout()
        }
        if (error.name === 'NotAuthenticated') {
          debug('...', 'no jwt token found')
          this.context.setState({
            initialized: false,
            loader: {
              visible: false,
              message: ''
            }
          })
          if (!window.location.pathname.includes('admin/login')) {
            window.location = window.location.origin + '/admin/login'
          }
        }
        debug('...', 'AnotherError', error)
        return AdminActions.networkLogout()
      })
  }
  disconnect () {
    debug('AdminHelpers', 'disconnect')
    cookie.remove('rememberMe', { path: '/' })
    this.context.setState({
      currentUser: false,
      loader: {
        visible: true,
        message: 'Déconnexion en cours...'
      }
    })
    this.context.state.client.logout().then(() => {
      debug('AdminHelpers', 'disconnect', 'client logout done')
      this.context.setState({
        loader: {
          visible: false,
          message: ''
        }
      })
      if (!window.location.pathname.includes('admin/login')) {
        window.location = window.location.origin + '/admin/login'
      }
    })
  }
  initialize () {
    debug('AdminHelpers', 'initialize')
    this.context.setState({loader: {
      visible: true,
      message: 'Chargement des data en cours...'
    }})
    debug('...', this.context.state.token)
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
      return true
    }).then((result) => {
      return this.context.state.client.service('api/styles').find({}).then((styles) => {
        let dictionnary = {}
        styles.map((style) => {
          dictionnary[style.id] = style
          return this
        })
        this.context.setState({styles: dictionnary})
        return true
      })
    }).then((result) => {
      this.context.setState({loader: {
        visible: true,
        message: 'Synchronisation des data en cours...'
      }})
      return this.dbs.mailings.local.allDocs({include_docs: true}).then((docs) => {
        this.context.setState({mailings: docs})
      })
    }).then(() => {
      return this.dbs.templates.local.allDocs({include_docs: true}).then((docs) => {
        this.context.setState({templates: docs})
      })
    }).then(() => {
      AdminActions.applicationCreationComplete()
    }).catch((error) => {
      debugerror(error)
      this.context.setState({token: false, loader: {visible: true, message: error.toString()}})
    })
  }
  creationComplete () {
    debug('AdminHelpers', 'creationComplete')
    this.context.setState({initialized: true, loader: {visible: false}, campaigns: this.context.state.campaigns})
  }
  emailingCampaign (key) {
    debug('AdminHelpers', 'emailingCampaign')
    // get sengrid campaign
    this.context.state.mailings.rows.map((item) => {
      if (item.id === key) {
        // send all campaigns
        item.doc.emails.map((email) => {
          return this.context.state.client.service('command/campaignCreateEmailing').create({
            email,
            url: window.location.origin,
            campaign: item.doc.campaign,
            template: item.doc.template,
            categories: item.doc.categories
          }).then((result) => {
            item.doc.done = true
            return this.dbs.mailings.local.put(item.doc)
          }).then(() => {
            return true
          }).catch(debugerror)
        })
      }
      return false
    })
  }
  refreshTemplates () {
    debug('AdminHelpers', 'refreshTemplates')
    this.context.state.client.service('command/sendgridRefreshAllTemplates').create({}).then((result) => {
      debug('...', result)
    }).catch(debugerror)
  }
  createMailing () {
    debug('AdminHelpers', 'createMailing')
    this.dbs.mailings.local.put({
      _id: uuid.v4(),
      name: 'Nouveau mailing',
      template: 'None',
      campaign: 'None',
      categories: [],
      emails: [],
      batch: false,
      done: false,
      created: Date.now()
    })
  }
  updateMailing (data) {
    debug('AdminHelpers', 'updateMailing')
    this.dbs.mailings.local.put(data)
  }
  createCampaign () {
    debug('AdminHelpers', 'createCampaign')
    return this.context.state.client.service('api/campaigns').create({
      name: 'Nouvelle campagne (' + uuid.v4() + ')',
      company: 'None',
      reader: 'abibao',
      position: 0,
      picture: 'images/default/campaign.png',
      data: {pages: [{name: 'page1'}]}
    }).then((campaign) => {
    }).catch(debugerror)
  }
  updateCampaign (data) {
    debug('AdminHelpers', 'updateCampaign')
    let newData = clone(data)
    this.context.state.client.service('api/campaigns').patch(newData.id, newData).then(() => {
    }).catch(debugerror)
  }
  updateCampaignData (campaign) {
    debug('AdminHelpers', 'updateCampaignData')
    AdminActions.campaignUpdate({
      id: campaign.id,
      data: campaign.data
    })
  }
  updateCampaignPicture (id, file) {
    debug('AdminHelpers', 'updateCampaignPicture')
    this.context.setState({loader: {visible: true, message: 'Upload image en cours...'}})
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
          debugerror(error)
        })
    }, false)
  }
  createStyle () {
    debug('AdminHelpers', 'createStyle')
    return this.context.state.client.service('api/styles').create({
      name: 'style-' + uuid.v4(),
      picture: 'images/default/campaign.png',
      styles: {},
      css: ''
    }).then(() => {
    }).catch(debugerror)
  }
  updateStyle (data) {
    debug('AdminHelpers', 'updateStyle')
    let newData = clone(data)
    this.context.state.client.service('api/styles').patch(newData.id, newData).then(() => {
    }).catch(debugerror)
  }
}

export default AdminHelpers
