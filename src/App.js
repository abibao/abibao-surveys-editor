import React from 'react'
import Reflux from 'reflux'

import { Link } from 'react-router'

import FeathersStore from './stores/FeathersStore'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

class App extends Reflux.Component {
  constructor (props) {
    super(props)
    this.stores = [FeathersStore]
    this.state = {open: false}
    this.handleToggle = () => this.setState({open: !this.state.open})
  }

  render () {
    // style
    const style = {
      drawer: {position: 'absolute', zIndex: 9999}
    }
    // elements
    let iconSurveysWall = () => (
      <FontIcon className="material-icons">view_quilt</FontIcon>
    )
    let iconMySurveys = () => (
      <FontIcon className="material-icons">view_list</FontIcon>
    )
    let iconClose = () => (
      <IconButton><FontIcon className="material-icons">close</FontIcon></IconButton>
    )
    let iconNetwork = () => (
      <IconButton><FontIcon className="material-icons">cloud_off</FontIcon></IconButton>
    )
    // override
    if (this.state.connected) {
      iconNetwork = () => (
        <IconButton><FontIcon className="material-icons">cloud</FontIcon></IconButton>
      )
    }
    // renderer
    return <MuiThemeProvider>
      <Paper zDepth={0}>
        <AppBar title="Abibao" onLeftIconButtonTouchTap={this.handleToggle} iconElementRight={iconNetwork()} />
        <Drawer open={this.state.open} style={style.drawer}>
          <AppBar title="Abibao" iconElementLeft={iconClose()} onLeftIconButtonTouchTap={this.handleToggle} />
          <Link to="/surveyswall"><MenuItem leftIcon={iconSurveysWall()}>Surveys wall</MenuItem></Link>
          <Link to="/surveys"><MenuItem leftIcon={iconMySurveys()}>My surveys</MenuItem></Link>
        </Drawer>
        {this.props.children}
      </Paper>
    </MuiThemeProvider>
  }
}

export default App
