// react
import React from 'react'
import Reflux from 'reflux'
import * as Survey from 'survey-react'

// actions
import AnswerActions from './../../../actions/AnswerActions'

import styles from './styles'
import './screen.css'

class SurveyReader extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {
      individual: this.props.individual,
      campaign: this.props.campaign
    }
    this.surveyComplete = () => {
      console.log('SurveyReader', 'surveyComplete')
      // now we make this survey complete in database
    }
    this.surveyValidateQuestion = (s, options) => {
      console.log('SurveyReader', 'surveyValidateQuestion')
      let answer = {
        'email': this.props.individual.email || this.props.individual,
        'campaign_id': this.state.campaign.id,
        'campaign_name': this.state.campaign.name,
        'charity_id': this.state.campaign.charity || null,
        'charity_name': this.state.campaign.charity || null,
        question: options.name,
        answer: options.value,
        answer_text: options.value
      }
      AnswerActions.answerUpsert(answer)
    }
  }
  render () {
    this.state.campaign = this.props.campaign
    let data = new Survey.Model(this.state.campaign.data)
    return (
      <div>
        <Survey.Survey onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
      </div>
    )
  }
}

export default SurveyReader
