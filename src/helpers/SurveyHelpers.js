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
        this.context.setState({selectedSurvey: response})
        this.context.setState({loader: {visible: false}})
      })
      .catch((error) => {
        console.error('...', error)
      })
  }

  complete (data) {
    Feathers.service('command/individualCompleteSurvey').create(data).then((response) => {
    }).catch(console.error)
  }
}

export default SurveyHelpers
