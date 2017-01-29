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
      tabs: {width: '100%'},
      tab: {backgroundColor: white, color: grey900, fontWeight: 'bold'},
      papers: {
        tabs: {position: 'relative', zIndex: 9000, backgroundColor: white},
        content: {padding: '1rem', backgroundColor: grey300, width: '100%', height: '400px'},
        empty: {background: 'url(images/7d14672328d13e06dab71c249e3826b0.png) no-repeat center / contain', width: '100%', height: '100%'}
      }
    }
    // elements
    let tabComponent = () => (
      <Paper style={style.papers.content} zDepth={0}>
        <div style={style.papers.empty}>&nbsp;</div>
        <h4 style={{textAlign: 'center', width: '100%'}}>No surveys for the moment!</h4>
      </Paper>
    )
    // override
    // renderer
    const renderer = () => (
      <Paper zDepth={0}>
        <Paper style={style.papers.tabs} zDepth={1}>
          <Tabs style={style.tabs}>
            <Tab label="All surveys" style={style.tab} data-route="/list_all" onActive={this.handleActive} />
            <Tab label="Progress" style={style.tab} data-route="/list_progress" onActive={this.handleActive} />
            <Tab label="Complete" style={style.tab} data-route="/list_complete" onActive={this.handleActive} />
          </Tabs>
        </Paper>
        {tabComponent()}
      </Paper>
    )
    return renderer()
  }
}

export default SurveysWall
