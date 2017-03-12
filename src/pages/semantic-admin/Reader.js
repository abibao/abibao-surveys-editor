/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'
import {clone} from 'lodash'
import uuid from 'uuid'
import cookie from 'react-cookie'
import Feathers from './../../libs/Feathers'

// components
import * as Readers from './../../components/readers'

// semantic
import { Container } from 'semantic-ui-react'

// store
import AdminStore from './../../stores/AdminStore'

// actions
import SurveyActions from './../../actions/SurveyActions'

class Reader extends Reflux.Component {
  componentDidMount () {
    let individual = uuid.v4()
    if (!this.state.individual) {
      this.setState({ individual })
      cookie.save('individual', individual, { path: '/' })
    }
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.selectedCampaign === false && this.state.campaigns[this.props.params.id]) {
      this.setState({selectedCampaign: this.state.campaigns[this.props.params.id]})
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      firstRenderer: true,
      individual: cookie.load('individual'),
      selectedCampaign: false,
      readers: {
        abibao: Readers.AbibaoReader,
        mqst: Readers.MQSTReader
      }
    }
    this.store = AdminStore
    Feathers.service('api/surveys').on('created', (survey) => {
      // console.log('survey created', survey)
    })
  }
  render () {
    let renderer = (CurrentReader) => (
      <Container fluid>
        <CurrentReader campaign={clone(this.state.selectedCampaign)} individual={this.state.individual} />
      </Container>
    )
    if (this.state.selectedCampaign === false) {
      return null
    } else {
      const label = (this.props.location.query.reader) ? this.props.location.query.reader : 'abibao'
      const reader = (this.state.readers[label]) ? this.state.readers[label] : this.state.readers['abibao']
      if (this.state.firstRenderer) {
        this.state.firstRenderer = false
        SurveyActions.surveyAffect({
          individual: this.state.individual,
          campaign: this.state.selectedCampaign.id,
          company: this.state.selectedCampaign.company
        })
      }
      return renderer(reader)
    }
  }
}

export default Reader
