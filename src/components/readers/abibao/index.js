import React from 'react'
import Reflux from 'reflux'

import * as Survey from 'survey-react'

import styles from './styles'
import './screen.css'
import './mobile.css'

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
    return (<Survey.Survey model={survey} css={styles} />)
  }
}

export default SurveyReader
