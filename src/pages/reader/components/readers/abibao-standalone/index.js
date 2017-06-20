/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import * as Survey from 'survey-react'

// actions
// import ReaderActions from './../../../libs/Actions'

import styles from './styles'
import './screen.css'

import Debug from 'debug'
const debug = Debug('abibao-platform:reader')

class SurveyReader extends Reflux.Component {
  componentDidMount () {
    // insert reader css
    let s = document.createElement('style')
    s.setAttribute('type', 'text/css')
    s.appendChild(document.createTextNode(this.props.survey.style.css))
    document.head.appendChild(s)
    // semantic embed
    window.$('.ui.embed').embed()
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.surveyComplete = () => {
      debug('SurveyReader', 'surveyComplete')
    }
    this.surveyValidateQuestion = (s, options) => {
      debug('SurveyReader', 'surveyValidateQuestion', options.name, options.value)
    }
  }
  render () {
    if (!this.props.survey) {
      return (null)
    }
    let data = new Survey.Model(this.props.survey.campaign.data)
    return (
      <Survey.Survey onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
    )
  }
}

export default SurveyReader
