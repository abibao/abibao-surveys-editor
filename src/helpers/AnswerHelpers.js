// libraries
import Feathers from './../libs/Feathers'

class AnswerHelpers {
  constructor (context) {
    this.context = context
  }

  upsert (data) {
    Feathers.service('commands/upsertAnsweringSurveyCommand').create(data).then((result) => {
      console.log(result)
    }).catch(console.error)
  }
}

export default AnswerHelpers
