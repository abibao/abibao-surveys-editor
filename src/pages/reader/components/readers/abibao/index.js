// react
import React from 'react'
import Reflux from 'reflux'
import * as Survey from 'survey-react'

// actions
import ReaderActions from './../../../libs/Actions'

import styles from './styles'
import './screen.css'
import './mobile.css'

import ImagePickerWidget from './../../../widgets/ImagePicker'

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
      ReaderActions.completeSurvey()
    }
    this.surveyValidateQuestion = (s, options) => {
      console.log('SurveyReader', 'surveyValidateQuestion', options.name, options.value)
      switch (options.value) {
        case 'ABIBAO_CGU_NO':
          console.log('...', 'CGU not accepted')
          return false
        default:
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
    }
  }
  render () {
    if (!this.props.survey) {
      return (null)
    }
    Survey.JsonObject.metaData.addProperty('dropdown', {name: 'renderAs', default: 'standard', choices: ['standard', 'imagepicker']})
    Survey.CustomWidgetCollection.Instance.addCustomWidget(ImagePickerWidget)
    let data = new Survey.Model(this.props.survey.campaign.data)
    return (
      <Survey.Survey onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
    )
  }
}

export default SurveyReader
