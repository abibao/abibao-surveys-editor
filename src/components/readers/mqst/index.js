import React from 'react'
import Reflux from 'reflux'

import * as Survey from 'survey-react'

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
    let survey = new Survey.Model(this.props.data)
    return (<Survey.Survey model={survey} />)
  }
}

export default SurveyReader
