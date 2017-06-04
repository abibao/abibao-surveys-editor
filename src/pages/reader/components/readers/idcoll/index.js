/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import * as Survey from 'survey-react'

import { Modal, Button } from 'semantic-ui-react'

// actions
import ReaderActions from './../../../libs/Actions'

import styles from './styles'
import './screen.css'

import Debug from 'debug'
const debug = Debug('abibao-platform:reader')
const debugerror = Debug('abibao-platform:error')

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
    debug('SurveyReader', 'constructor')
    this.state = {
      open: false,
      data: {},
      randomAnswer: {answer: 'Pas de correspondance'},
      randomQuestion: ''
    }
    this.valueChanged = (s, options) => {
      debug('SurveyReader', 'valueChanged')
      this.setState({data: s.data})
    }
    this.afterRenderQuestion = (s, options) => {
      debug('SurveyReader', 'afterRenderQuestion')
      options.htmlElement.className += ' ' + options.question.name
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
      debug('SurveyReader', 'surveyValidateQuestion')
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
    this.nextAnswer = (e) => {
      this.handleGetRandomAnswer(this.state.randomQuestion)
    }
    this.closeAnser = (e) => {
      this.setState({open: false, randomAnswer: {answer: 'Pas de correspondance'}})
    }
    this.handleGetRandomAnswer = (question) => {
      debug('SurveyReader', 'handleGetRandomAnswer', question)
      return this.props.client.service('query/answerGetRandomAnswer').find({query: {
        campaign: this.props.survey.campaign.id,
        individual: this.props.survey.individual,
        question
      }}).then((result) => {
        this.setState({open: true, randomQuestion: question, randomAnswer: result})
      }).catch((error) => {
        this.setState({open: false, randomAnswer: {answer: 'Pas de correspondance'}})
        debugerror(error)
      })
    }
    window.openGetRandomAnswer = this.handleGetRandomAnswer
    window.jQuery = window.$
    window.jQuery.getScript('//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.js')
  }
  render () {
    if (!this.props.survey) {
      return (null)
    }
    const { open } = this.state
    let data = new Survey.Model(this.props.survey.campaign.data)
    return (
      <div className="semantic-reader-container">
        <Modal open={open}>
          <Modal.Header>
            Besoin d’inspiration ?
          </Modal.Header>
          <Modal.Content>
            <p>{this.state.randomAnswer.answer}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeAnser}>Fermer</Button>
            <Button color="grey" onClick={this.nextAnswer}>Suivant</Button>
          </Modal.Actions>
        </Modal>
        <Survey.Survey data={this.state.data} onValueChanged={this.valueChanged} onAfterRenderQuestion={this.afterRenderQuestion} onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
      </div>
    )
  }
}

export default SurveyReader
