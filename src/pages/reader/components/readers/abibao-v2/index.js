/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import * as Survey from 'survey-react'

// actions
import ReaderActions from './../../../libs/Actions'

import styles from './styles'
import './screen.css'

import ImagePickerWidget from './../../../widgets/ImagePicker'
import ImagesSelectorWidget from './../../../widgets/ImagesSelector'

import Debug from 'debug'
const debug = Debug('abibao-platform:reader')

class SurveyReader extends Reflux.Component {
  ccomponentDidMount () {
    // insert reader css
    let s = document.createElement('style')
    s.setAttribute('type', 'text/css')
    s.appendChild(document.createTextNode(this.props.survey.style.css))
    document.head.appendChild(s)
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.surveyComplete = () => {
      debug('SurveyReader', 'surveyComplete')
      ReaderActions.completeSurvey()
    }
    this.surveyValidateQuestion = (s, options) => {
      debug('SurveyReader', 'surveyValidateQuestion', options.name, options.value)
      switch (options.value) {
        case 'ABIBAO_CGU_NO':
          debug('...', 'CGU not accepted')
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
    Survey.JsonObject.metaData.addProperty('checkbox', {name: 'renderAs', default: 'standard', choices: ['standard', 'images_selector']})
    Survey.CustomWidgetCollection.Instance.addCustomWidget(ImagePickerWidget)
    Survey.CustomWidgetCollection.Instance.addCustomWidget(ImagesSelectorWidget)
    let data = new Survey.Model(this.props.survey.campaign.data)
    return (
      <Survey.Survey onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
    )
  }
}

export default SurveyReader
