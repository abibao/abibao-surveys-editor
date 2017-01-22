import React from 'react'
import Reflux from 'reflux'

import FeathersStore from './../stores/FeathersStore'

import Paper from 'material-ui/Paper'

class SurveyEditor extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [FeathersStore]
    this.state = {}
  }

  render () {
    // renderer
    const renderer = () => (
      <Paper zDepth={0}>
        <h2>Survey Editor</h2>
        <iframe src="//localhost:3000/editor.html" width="100%" height="100%"></iframe>
      </Paper>
    )
    return renderer()
  }
}

export default SurveyEditor
