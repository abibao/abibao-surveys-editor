import React from 'react'
import Reflux from 'reflux'

import Paper from 'material-ui/Paper'
import {grey300, grey900, white, cyan500} from 'material-ui/styles/colors'
import {Tabs, Tab} from 'material-ui/Tabs'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import {Card, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

import FeathersStore from './../stores/FeathersStore'

class Surveys extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [FeathersStore]
    this.state = {tab: '/list'}
    this.handleActive = (tab) => {
      this.setState({tab: tab.props['data-route']})
    }
    this.handleCreateSurvey = () => {
      console.log('component, create a survey')
      const store = this.stores[0]
      store.createSurvey()
    }
  }

  render () {
    // style
    const style = {
      tabs: {width: '200px'},
      tab: {backgroundColor: white, color: grey900, fontWeight: 'bold'},
      papers: {
        tabs: {position: 'relative', zIndex: 9000, backgroundColor: white},
        content: {padding: '1rem', backgroundColor: grey300}
      },
      floating: {position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 9999},
      gridList: {flexWrap: 'wrap', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'},
      card: {width: '300px', margin: '10px'}
    }
    // elements
    let iconSurveyEdit = (url) => (
      <a href={url} target="_new">
        <IconButton tooltip="Edit this survey" tooltipPosition="top-center">
          <FontIcon color={cyan500} className="material-icons">mode_edit</FontIcon>
        </IconButton>
      </a>
    )
    let tabComponent = () => (
      <Paper style={style.papers.content} zDepth={0}>
        <div style={style.gridList}>
          {this.state.surveys.data.map((survey) => (
            <Card style={style.card} key={survey.id}>
              <CardTitle title={survey.name} subtitle="Abibao" />
              <CardMedia>
                <div style={{background: 'url(images/574efe952775faef68604ffc1480273149476.png) center center / cover', width: '300px', height: '200px'}} />
              </CardMedia>
              <CardActions>
                {iconSurveyEdit('editor.html?' + survey.id)}
              </CardActions>
            </Card>
          ))}
        </div>
      </Paper>
    )
    // override
    // renderer
    const renderer = () => (
      <Paper zDepth={0}>
        <Paper style={style.papers.tabs} zDepth={1}>
          <Tabs style={style.tabs}>
            <Tab label="My surveys" style={style.tab} data-route="/list" onActive={this.handleActive} />
          </Tabs>
        </Paper>
        {tabComponent()}
        <a href="#" onClick={this.handleCreateSurvey}>
          <FloatingActionButton style={style.floating} secondary zDepth={1}>
            <ContentAdd />
          </FloatingActionButton>
        </a>
      </Paper>
    )
    return renderer()
  }
}

export default Surveys
