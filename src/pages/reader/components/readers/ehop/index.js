// react
import React from 'react'
import Reflux from 'reflux'
import * as Survey from 'survey-react'

// libraries
import Feathers from './../../../../../libs/Feathers'

// actions
import AnswerActions from './../../../../../actions/AnswerActions'
import SurveyActions from './../../../../../actions/SurveyActions'

import styles from './styles'
import './screen.css'
import './mobile.css'

class SurveyReader extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.surveyComplete = () => {
      console.log('SurveyReader', 'surveyComplete')
      SurveyActions.surveyComplete()
    }
    this.surveyValidateQuestion = (s, options) => {
      console.log('SurveyReader', 'surveyValidateQuestion')
      let answer = {
        'email': this.props.survey.individual.email || this.props.survey.individual,
        'survey_id': this.props.survey.id,
        'campaign_id': this.props.survey.campaign.id,
        'campaign_name': this.props.survey.campaign.name,
        'charity_id': this.props.survey.campaign.charity || null,
        'charity_name': this.props.survey.campaign.charity || null,
        question: options.name,
        answer: options.value
      }
      AnswerActions.answerUpsert(answer)
    }
    this.handleGetRandomAnswer = () => {
      return Feathers.service('query/answerGetRandom').get({
        campaign: this.props.survey.campaign.id,
        email: this.props.survey.individual.email || this.props.survey.individual
      })
    }
    window.handleGetRandomAnswer = this.handleGetRandomAnswer
  }
  render () {
    if (!this.props.survey) {
      return (null)
    }
    Survey.Survey.cssType = 'bootstrap'
    let data = new Survey.Model(this.props.survey.campaign.data)
    return (
      <Survey.Survey onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
    )
  }
}

export default SurveyReader
