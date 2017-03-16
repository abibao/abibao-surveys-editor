// libraries
import Feathers from './../libs/Feathers'

class AnswerHelpers {
  constructor (context) {
    this.context = context
  }

  upsert (data) {
    Feathers.service('command/individualAnswerSurvey').create(data).then((result) => {
    }).catch(console.error)
  }
}

export default AnswerHelpers
