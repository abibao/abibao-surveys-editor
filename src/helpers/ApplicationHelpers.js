// libraries
import Feathers from './../libs/Feathers'

// actions
import ApplicationActions from './../actions/ApplicationActions'

class ApplicationHelpers {
  constructor (context) {
    this.context = context
  }
  initialize () {
    console.log('ApplicationHelpers', 'initialize')
    this.context.setState({loader: {visible: true}})
    return Feathers.service('api/campaigns').find().then((campaigns) => {
      let dictionnary = {}
      campaigns.map((campaign) => {
        dictionnary[campaign.id] = campaign
        return true
      })
      this.context.setState({campaigns: dictionnary})
      return Feathers.service('api/entities').find().then((entities) => {
        let dictionnary = {}
        entities.map((entity) => {
          dictionnary[entity.id] = entity
          return true
        })
        this.context.setState({entities: dictionnary})
        // on complete then ...
        ApplicationActions.applicationCreationComplete()
      })
    }).catch((error) => {
      console.error('...', error)
      if (error.toString() === 'Forbidden: You do not have the correct permissions.') {
        window.localStorage.removeItem('rememberMe')
      }
      this.context.setState({token: false, loader: {visible: false}})
    })
  }
  creationComplete () {
    console.log('ApplicationHelpers', 'creationComplete')
    // populate campaigns
    Object.keys(this.context.state.campaigns).map((key) => {
      let val = this.context.state.campaigns[key].company
      this.context.state.campaigns[key].company = this.context.state.entities[val] || {name: 'Aucune'}
      return true
    })
    this.context.setState({initialized: true, loader: {visible: false}, campaigns: this.context.state.campaigns})
  }
}

export default ApplicationHelpers
