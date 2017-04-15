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
      ApplicationActions.applicationCreationComplete()
    }).catch((error) => {
      this.context.setState({token: false, loader: {visible: false}})
    })
  }
  creationComplete () {
    console.log('ApplicationHelpers', 'creationComplete')
    this.context.setState({initialized: true, loader: {visible: false}, campaigns: this.context.state.campaigns})
  }
}

export default ApplicationHelpers
