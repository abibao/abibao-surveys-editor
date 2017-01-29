import React from 'react'
import Reflux from 'reflux'

import Paper from 'material-ui/Paper'
import {Tabs, Tab} from 'material-ui/Tabs'
import {grey300, grey900, white} from 'material-ui/styles/colors'

import FeathersStore from './../stores/FeathersStore'

class SurveysWall extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [FeathersStore]
    this.state = {}
  }

  render () {
    // style
    const style = {
      tabs: {width: '200px'},
      tab: {backgroundColor: white, color: grey900, fontWeight: 'bold'},
      papers: {
        tabs: {position: 'relative', zIndex: 9000, backgroundColor: white},
        content: {padding: '1rem', backgroundColor: grey300}
      }
    }
    // elements
    let tabComponent = () => (
      <Paper style={style.papers.content} zDepth={0} />
    )
    // override
    // renderer
    const renderer = () => (
      <Paper zDepth={0}>
        <Paper style={style.papers.tabs} zDepth={1}>
          <Tabs style={style.tabs}>
            <Tab label="All surveys" style={style.tab} data-route="/list_all" onActive={this.handleActive} />
          </Tabs>
        </Paper>
        {tabComponent()}
      </Paper>
    )
    return renderer()
  }
}

export default SurveysWall
