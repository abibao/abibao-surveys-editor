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
    this.state = { open: false, randomAnswer: {answer: 'Pas de correspondance'}, randomQuestion: '' }
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
    this.nextAnswer = (e) => {
      this.handleGetRandomAnswer(this.state.randomQuestion)
    }
    this.handleGetRandomAnswer = (question) => {
      console.log('SurveyReader', 'handleGetRandomAnswer', question)
      return this.props.client.service('query/answerGetRandomAnswer').find({query: {
        campaign: this.props.survey.campaign.id,
        individual: this.props.survey.individual,
        question
      }}).then((result) => {
        this.setState({open: true, randomQuestion: question, randomAnswer: result})
      }).catch((error) => {
        this.setState({open: false, randomAnswer: {answer: 'Pas de correspondance'}})
        console.error(error)
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
      <div>
        <Modal open={open}>
          <Modal.Header>
            Besoin d’inspiration ?
          </Modal.Header>
          <Modal.Content>
            <p>{this.state.randomAnswer.answer}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={(e) => this.setState({open: false, randomAnswer: {answer: 'Pas de correspondance'}})}>Fermer</Button>
            <Button color="grey" onClick={this.nextAnswer}>Suivant</Button>
          </Modal.Actions>
        </Modal>
        <Survey.Survey onComplete={this.surveyComplete} onValidateQuestion={this.surveyValidateQuestion} model={data} css={styles} />
      </div>
    )
  }
}

export default SurveyReader