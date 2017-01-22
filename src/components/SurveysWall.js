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
    // override
    // renderer
    const renderer = () => (
      <h2>Surveys Wall</h2>
    )
    return renderer()
  }
}

export default SurveysWall
