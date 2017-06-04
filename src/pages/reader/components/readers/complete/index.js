/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import ReactMarkdown from 'react-markdown'

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
    this.state = {
      message: '# ' + this.props.survey.campaign.name + '\n#### Ce sondage n\'est pas disponible.'
    }
  }
  render () {
    return (
      <ReactMarkdown className="markdown-body" source={this.state.message} />
    )
  }
}

export default SurveyReader
