/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import uuid from 'uuid'
import cookie from 'react-cookie'

// components
import * as Readers from './components/readers'

// semantic
import { Container, Loader } from 'semantic-ui-react'

// store
import ReaderStore from './../../stores/ReaderStore'

// actions
import SurveyActions from './../../actions/SurveyActions'

function getParams (search) {
  const temp = search.split('?').join('').split('&')
  let params = {}
  temp.map((item) => {
    params[item.split('=')[0]] = item.split('=')[1]
    return true
  })
  return params
}

class Reader extends Reflux.Component {
  componentDidMount () {
    console.log('Reader', 'componentDidMount')
    let individual = uuid.v4() + '@abibao.com'
    if (!this.state.individual) {
      this.setState({ individual })
      cookie.save('individual', individual, { path: '/' })
    }
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.selectedSurvey === false && this.state.token !== false) {
      console.log('Time to affect the campaign or load the survey for user')
      this.state.selectedSurvey = true
      let text = JSON.stringify(getParams(this.props.location.search))
      SurveyActions.surveyAffect({individual: this.state.individual, campaign: this.props.params.id, params: JSON.parse(text)})
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      individual: cookie.load('individual'),
      readers: {
        abibao: Readers.AbibaoReader,
        ehop: Readers.EHOPReader
      }
    }
    this.store = ReaderStore
  }
  render () {
    let loader = () => {
      return (
        <Container fluid className="loader-reader">
          <Loader active size="huge">Chargement en cours...</Loader>
        </Container>
      )
    }
    let renderer = (CurrentReader) => (
      <Container fluid>
        <CurrentReader survey={this.state.selectedSurvey} />
      </Container>
    )
    if (this.state.loader.visible === true) {
      return loader()
    } else {
      const label = (this.props.location.query.reader) ? this.props.location.query.reader : 'abibao'
      const reader = (this.state.readers[label]) ? this.state.readers[label] : this.state.readers['abibao']
      return renderer(reader)
    }
  }
}

export default Reader
