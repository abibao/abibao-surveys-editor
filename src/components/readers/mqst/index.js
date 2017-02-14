import React from 'react'
import Reflux from 'reflux'

import * as Survey from 'survey-react'

import data from './data.json'

var survey = new Survey.Model(data)

class SurveyReader extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (<Survey.Survey model={survey} />)
  }
}

export default SurveyReader
