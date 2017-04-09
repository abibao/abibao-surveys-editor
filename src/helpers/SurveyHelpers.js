// libraries
import Feathers from './../libs/Feathers'

class SurveyHelpers {
  constructor (context) {
    this.context = context
  }

  affect (data) {
    this.context.setState({loader: {visible: true}})
    Feathers.service('command/individualAffectSurvey').create(data)
      .then((response) => {
        this.context.setState({selectedSurvey: response})
        this.context.setState({loader: {visible: false}})
      })
      .catch((error) => {
        if (error.toString() === 'Error: ABIBAO_ERROR_AFFECT_POSITION_1') {
          console.error('we need to auto affect abibao survey 1')
          this.context.setState({askEmail: true, loader: {visible: false}})
        } else {
          console.error('...', error)
        }
      })
  }

  affectAbibaoPosition1 (email) {
    this.context.setState({loader: {visible: true}})
    Feathers.service('command/individualAffectAbibaoSurveyPosition1').create({email, origin: window.location.href}).then((result) => {
      if (result.connected === true) {
        console.log('connected', result.connected)
        this.context.setState({passwordless: true})
      } else {
        console.log('connected', result.connected)
        window.location = window.location.origin + '/reader/' + result.campaign + window.location.search + '&individual=' + result.urn
      }
      this.context.setState({loader: {visible: false}})
    }).catch(console.error)

  }

  complete (data) {
    Feathers.service('command/individualCompleteSurvey').create(data).then((response) => {
    }).catch(console.error)
  }
}

export default SurveyHelpers
