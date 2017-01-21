import React from 'react'
import Reflux from 'reflux'

import Paper from 'material-ui/Paper'
import {grey300, grey900, white} from 'material-ui/styles/colors'
import {Tabs, Tab} from 'material-ui/Tabs'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import FeathersStore from './../stores/FeathersStore'

class Surveys extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [FeathersStore]
    this.state = {}
    this.handleCreateSurvey = () => {
      console.log('component, create a survey')
      const store = this.stores[0]
      store.createSurvey()
    }
  }

  render () {
    const style = {
      tabs: {width: '200px'},
      tab: {backgroundColor: white, color: grey900, fontWeight: 'bold'},
      papers: {
        tabs: {position: 'relative', zIndex: 9999, backgroundColor: white},
        content: {padding: '1rem', backgroundColor: grey300}
      },
      floating: {position: 'absolute', right: '1rem', bottom: '1rem'}
    }
    // renderer
    return <Paper zDepth={0}>
            <Paper style={style.papers.tabs} zDepth={1}>
              <Tabs style={style.tabs}>
                <Tab label="My surveys" style={style.tab} />
              </Tabs>
            </Paper>
            <Paper style={style.papers.content} zDepth={0}>
            </Paper>
            <a href="#" onClick={this.handleCreateSurvey}>
              <FloatingActionButton style={style.floating} secondary zDepth={1}>
                <ContentAdd />
              </FloatingActionButton>
            </a>
          </Paper>
  }
}

export default Surveys
