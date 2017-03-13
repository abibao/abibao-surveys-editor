// libraries
import Feathers from './../libs/Feathers'

class AnswerHelpers {
  constructor (context) {
    this.context = context
  }

  upsert (data) {
    Feathers.service('api/answers').find({query: {
      email: data.email,
      'campaign_id': data['campaign_id'],
      question: data.question
    }}).then((result) => {
      if (result.length === 0) {
        console.log('AnswerHelpers', 'create', data)
        return Feathers.service('api/answers').create(data)
      } else {
        console.log('AnswerHelpers', 'update', data)
        return Feathers.service('api/answers').update(result[0].id, data)
      }
    }).catch(console.error)
  }
}

export default AnswerHelpers
