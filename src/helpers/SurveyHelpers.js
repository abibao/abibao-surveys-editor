// libraries
import Feathers from './../libs/Feathers'

class SurveyHelpers {
  constructor (context) {
    this.context = context
  }

  affect (data) {
  	Feathers.service('api/surveys').find(data).then((result) => {
  		if(result.length ===0 ) {
  			return Feathers.service('api/surveys').create(data)
  		}
  	}).catch(console.error)
  }
}

export default SurveyHelpers