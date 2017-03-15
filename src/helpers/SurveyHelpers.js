// libraries
import Feathers from './../libs/Feathers'

class SurveyHelpers {
  constructor (context) {
    this.context = context
  }

  affect (data) {
    this.context.state.loader.visible = true
    Feathers.service('command/individualAffectSurvey').create(data)
      .then((response) => {
        this.context.setState({selectedSurvey: response, selectedCampaign: response.campaign})
      })
      .catch((error) => {
        console.error('...', error)
      })
  }
}

export default SurveyHelpers
