// react
import React from 'react'
import Reflux from 'reflux'
import * as Survey from 'survey-react'

// actions
import ReaderActions from './../../../libs/Actions'

class SurveyReader extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    console.log('SurveyReader', 'constructor')
    this.surveyComplete = () => {
      console.log('SurveyReader', 'surveyComplete')
      ReaderActions.completeSurvey()
    }
    this.surveyValidateQuestion = (s, options) => {
      console.log('SurveyReader', 'surveyValidateQuestion')
      let answer = {
        'individual': this.props.survey.individual,
        'survey_id': this.props.survey.id,
        'campaign_id': this.props.survey.campaign.id,
        'campaign_name': this.props.survey.campaign.name,
        question: options.name,
        answer: options.value
      }
      ReaderActions.answerSurvey(answer)
    }
    this.handleGetRandomAnswer = () => {
      console.log('SurveyReader', 'handleGetRandomAnswer')
      return this.props.client.service('query/answerGetRandomAnswer').find({
        campaign: this.props.survey.campaign.id,
        email: this.props.survey.individual
      }).catch((error) => {
        console.error(error)
      })
    }
    window.handleGetRandomAnswer = this.handleGetRandomAnswer
  }
  render () {
    if (!this.props.survey) {
      return (null)
    }
    let data = new Survey.Model(this.props.survey.campaign.data)
    return (
      <Survey.Survey onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} />
    )
  }
}

export default SurveyReader
