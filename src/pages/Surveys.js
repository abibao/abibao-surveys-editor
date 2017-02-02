import React from 'react'
import Reflux from 'reflux'

import Paper from 'material-ui/Paper'
import {grey300, grey900, white} from 'material-ui/styles/colors'
import {Tabs, Tab} from 'material-ui/Tabs'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import {Card, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

// import FeathersStore from './../stores/FeathersStore'

import EditSurveyDialog from './../components/surveys/EditSurveyDialog'

class Surveys extends Reflux.Component {
  constructor (props) {
    super(props)
    // this.stores = [FeathersStore]
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
      tabs: {width: '100%'},
      tab: {backgroundColor: white, color: grey900, fontWeight: 'bold'},
      papers: {
        tabs: {position: 'relative', zIndex: 9000, backgroundColor: white},
        content: {padding: '1rem', backgroundColor: grey300}
      },
      floating: {position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 9999},
      gridList: {flexWrap: 'wrap', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'},
      card: {width: '300px', margin: '10px'},
      cardActionsLeft: {float: 'left'},
      cardActionsRight: {float: 'right', marginRight: 0},
      titleStyle: {overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}
    }
    // elements
    let iconSurveyEdit = (url) => (
      <a style={style.cardActionsRight} href={url} target="_new">
        <RaisedButton label="Editor" primary />
      </a>
    )
    let tabComponent = () => (
      <Paper style={style.papers.content} zDepth={0}>
        <div style={style.gridList}>
          {this.state.surveys.data.map((survey) => (
            <Card style={style.card} key={survey.id}>
              <CardTitle title={survey.name} titleStyle={style.titleStyle} subtitle="Abibao" />
              <CardMedia>
                <div style={{background: 'url(images/574efe952775faef68604ffc1480273149476.png) no-repeat center / cover', width: '300px', height: '200px'}} />
              </CardMedia>
              <CardActions>
                {iconSurveyEdit('editor.html?' + survey.id)}
                <EditSurveyDialog style={style.cardActionsLeft} survey={survey} />
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
        <a href="#" onTouchTap={this.handleCreateSurvey}>
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
