import React from 'react'
import Reflux from 'reflux'

import * as Survey from 'survey-react'

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
    this.surveyValidateQuestion = (s, options) => {
      let answer = {
        'email': this.props.individual.email || this.props.individual + '@abibao.com',
        'campaign_id': this.state.campaign.id,
        'campaign_name': this.state.campaign.name,
        'charity_id': this.state.campaign.charity || null,
        'charity_name': this.state.campaign.charity || null,
        question: options.name,
        answer: options.value,
        answer_text: options.value
      }
      console.log(answer)
    }
  }
  render () {
    this.state.campaign = this.props.campaign
    let data = new Survey.Model(this.state.campaign.data)
    return (
      <div>
        <Survey.Survey onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
      </div>
    )
  }
}

export default SurveyReader
