/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import * as Survey from 'survey-react'

import { Modal, Button } from 'semantic-ui-react'

// actions
import ReaderActions from './libs/Actions'

// surveyJS
import Styles from './Styles'
import ImagePickerWidget from './widgets/ImagePicker'
import ImagesSelectorWidget from './widgets/ImagesSelector'

import Debug from 'debug'
const debug = Debug('abibao-platform:player')

class SurveyPlayer extends Reflux.Component {
  componentDidMount () {
    // insert player css
    debug('SurveyPlayer', 'insert cssPlayer', this.props.survey.campaign.reader)
    let cssPlayer = document.createElement('link')
    cssPlayer.setAttribute('href', window.location.origin + '/styles/' + this.props.survey.campaign.reader + '/main.css')
    cssPlayer.setAttribute('rel', 'stylesheet')
    document.head.appendChild(cssPlayer)
    // insert override css
    debug('SurveyPlayer', 'insert cssOverride', this.props.survey.campaign.reader)
    let cssOverride = document.createElement('style')
    cssOverride.setAttribute('type', 'text/css')
    cssOverride.appendChild(document.createTextNode(this.props.survey.style.css))
    document.head.appendChild(cssOverride)
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      data: {},
      randomAnswer: {answer: 'Pas de correspondance'},
      randomQuestion: ''
    }
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
      debug('SurveyPlayer', 'afterRenderQuestion')
      options.htmlElement.className += ' ' + options.question.name
      this.checkEmbed()
      console.log(s.currentPageNo, s.PageCount, window.$('body.abibao.mobile .reader-abibao .sui.progress').css('background-image'))
      // progress bar for player: abibao
      let percent = (s.currentPageNo / s.PageCount) * 100
      if (percent < 25) {
        window.$('body.abibao .reader-abibao .sui.progress').css('border-top-color', '#e2e7e9')
      }
      if (percent >= 25) {
        window.$('body.abibao .reader-abibao .sui.progress').css('border-top-color', '#d48d2c')
        window.$('body.abibao .reader-abibao .sui.progress').css('border-right-color', '#e2e7e9')
      }
      if (percent >= 50) {
        window.$('body.abibao .reader-abibao .sui.progress').css('border-right-color', '#d48d2c')
        window.$('body.abibao .reader-abibao .sui.progress').css('border-bottom-color', '#e2e7e9')
      }
      if (percent >= 75) {
        window.$('body.abibao .reader-abibao .sui.progress').css('border-bottom-color', '#d48d2c')
        window.$('body.abibao .reader-abibao .sui.progress').css('border-left-color', '#e2e7e9')
      }
      if (percent === 100) {
        window.$('body.abibao .reader-abibao .sui.progress').css('border-left-color', '#d48d2c')
      }
    }
    this.valueChanged = (s, options) => {
      debug('SurveyPlayer', 'valueChanged')
    }
    this.surveyComplete = () => {
      debug('SurveyPlayer', 'surveyComplete')
      window.ReactGA.event({
        category: 'Survey',
        action: 'Complete',
        label: this.props.survey.campaign.name
      })
      ReaderActions.completeSurvey()
    }
    this.surveyValidateQuestion = (s, options) => {
      debug('SurveyPlayer', 'surveyValidateQuestion', options.name, options.value)
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
    //
    this.nextAnswer = (e) => {
      this.handleGetRandomAnswer(this.state.randomQuestion)
    }
    this.closeAnswer = (e) => {
      this.setState({open: false, randomAnswer: {answer: 'Pas de correspondance'}})
    }
    this.handleGetRandomAnswer = (question) => {
      debug('SurveyPlayer', 'handleGetRandomAnswer', question)
      return this.props.client.service('query/answerGetRandomAnswer').find({query: {
        campaign: this.props.survey.campaign.id,
        individual: this.props.survey.individual,
        question
      }}).then((result) => {
        this.setState({open: true, randomQuestion: question, randomAnswer: result})
      }).catch((error) => {
        this.setState({open: false, randomAnswer: {answer: 'Pas de correspondance'}})
        console.log(error)
      })
    }
    //
    window.openGetRandomAnswer = this.handleGetRandomAnswer
    window.jQuery = window.$
    window.jQuery.getScript('//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.js')
  }
  render () {
    if (!this.props.survey) {
      return (null)
    }
    const { open } = this.state
    Survey.JsonObject.metaData.addProperty('dropdown', {name: 'renderAs', default: 'standard', choices: ['standard', 'imagepicker']})
    Survey.JsonObject.metaData.addProperty('checkbox', {name: 'renderAs', default: 'standard', choices: ['standard', 'images_selector']})
    Survey.CustomWidgetCollection.Instance.addCustomWidget(ImagePickerWidget)
    Survey.CustomWidgetCollection.Instance.addCustomWidget(ImagesSelectorWidget)
    let data = new Survey.Model(this.props.survey.campaign.data)
    return (
      <div className="reader-container">
        <Modal open={open}>
          <Modal.Header>
            Besoin d’inspiration ?
          </Modal.Header>
          <Modal.Content>
            <p>{this.state.randomAnswer.answer}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeAnswer}>Fermer</Button>
            <Button color="grey" onClick={this.nextAnswer}>Suivant</Button>
          </Modal.Actions>
        </Modal>
        <Survey.Survey
          data={this.state.data}
          onValueChanged={this.valueChanged}
          onAfterRenderQuestion={this.afterRenderQuestion}
          onComplete={this.surveyComplete}
          onValidateQuestion={this.surveyValidateQuestion}
          model={data}
          css={Styles} />
      </div>
    )
  }
}

// this.props.survey.campaign.reader

export default SurveyPlayer
