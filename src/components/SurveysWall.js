import React from 'react'
import Reflux from 'reflux'

import FeathersStore from './../stores/FeathersStore'

class SurveysWall extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [FeathersStore]
    this.state = {}
  }

  render () {
    // renderer
    return <h2>Surveys Wall</h2>
  }
}

export default SurveysWall
