// libraries
import Feathers from './../libs/Feathers'

class SurveyHelpers {
  constructor (context) {
    this.context = context
  }

  affect (data) {
    console.log('survey affect', data)
    Feathers.service('command/individualAffectSurvey').create(data)
      .then((response) => {
        console.log('...', response)
      })
      .catch((error) => {
        console.error('...', error)
      })
  }
}

export default SurveyHelpers
