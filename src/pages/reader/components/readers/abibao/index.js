/* eslint jsx-quotes: ["error", "prefer-double"] */

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
import ImagesSelectorWidget from './../../../widgets/ImagesSelector'

import Debug from 'debug'
const debug = Debug('abibao-platform:reader')

class SurveyReader extends Reflux.Component {
  componentDidMount () {
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
    // check embed access
    this.checkEmbed = () => {
      console.log('checkEmbed')
      if (window.$ && window.$('.ui.embed').embed) {
        window.$('.ui.embed').embed()
      } else {
        setTimeout(() => {
          this.checkEmbed()
        }, 250)
      }
    }
    this.afterRenderQuestion = (s, options) => {
      debug('SurveyReader', 'afterRenderQuestion')
      options.htmlElement.className += ' ' + options.question.name
      this.checkEmbed()
    }
    this.surveyComplete = () => {
      debug('SurveyReader', 'surveyComplete')
      window.ReactGA.event({
        category: 'Survey',
        action: 'Complete',
        label: this.props.survey.campaign.name
      })
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
          window.ReactGA.event({
            category: 'Survey',
            action: 'Validate Question',
            label: this.props.survey.campaign.name
          })
          ReaderActions.answerSurvey(answer)
      }
    }
    window.jQuery = window.$
    window.jQuery.getScript('//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.js')
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
      <Survey.Survey onAfterRenderQuestion={this.afterRenderQuestion} onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
    )
  }
}

export default SurveyReader
