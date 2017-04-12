// libraries
import Feathers from './../libs/Feathers'

class SurveyHelpers {
  constructor (context) {
    this.context = context
  }

  affect (data) {
    console.log('SurveyHelpers', 'affect', data.individual)
    Feathers.service('command/individualAffectSurvey').create(data)
      .then((response) => {
        this.context.setState({selectedSurvey: response, loader: {visible: false, message: ''}})
      })
      .catch((error) => {
        if (error.toString() === 'Error: ABIBAO_INDIVIDUAL_CONTROL_SECURITY') {
          console.error('we need to ask email')
          this.context.setState({askEmail: true, loader: {visible: false, message: ''}})
        } else {
          console.error('...', error)
        }
      })
  }

  controlSecurity (email) {
    console.log('SurveyHelpers', 'control security')
    this.context.setState({loader: {visible: true, message: ''}})
    Feathers.service('command/surveyControlSecurity').create({email, origin: window.location.href}).then((result) => {
      console.log('...', result)
      if (result.connected === true) {
        console.log('connected', result.connected)
        this.context.setState({passwordless: true})
      } else {
        console.log('connected', result.connected)
        this.context.setState({passwordless: false})
        window.location = window.location.href + '&individual=' + result.urn
      }
      this.context.setState({loader: {visible: false, message: ''}})
    }).catch((error) => {
      console.error(error)
      this.context.setState({loader: {visible: false, message: ''}})
    })

  }

  complete (data) {
    Feathers.service('command/individualCompleteSurvey').create(data).then((response) => {
    }).catch(console.error)
  }
}

export default SurveyHelpers
