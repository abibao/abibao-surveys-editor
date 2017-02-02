import React from 'react'
import Reflux from 'reflux'

import AppStore from '../stores/AppStore'

import { browserHistory } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import {grey300} from 'material-ui/styles/colors'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

class App extends Reflux.Component {
  componentDidMount () {
  }

  constructor (props) {
    super(props)
    this.stores = [AppStore]
    this.state = {open: false}
    this.handleToggle = () => this.setState({open: !this.state.open})
    this.handleLogout = () => {
      const store = this.stores[0]
      store.logout()
      browserHistory.push('/login')
    }
    this.handleSurveysWall = () => {
      browserHistory.push('/surveyswall')
    }
  }

  render () {
    // style
    const style = {
      papers: {
        content: {
          background: grey300,
          width: '100%',
          minHeight: '100%'
        }
      },
      drawer: {position: 'absolute', zIndex: 9999},
      link: {textDecoration: 'none'}
    }
    // elements
    let iconClose = () => (
      <IconButton><FontIcon className="material-icons">close</FontIcon></IconButton>
    )
    let iconNetwork = () => (
      <IconButton><FontIcon className="material-icons">cloud_off</FontIcon></IconButton>
    )
    if (this.state.networkOnline) {
      iconNetwork = () => (
        <IconButton><FontIcon className="material-icons">cloud</FontIcon></IconButton>
      )
    }
    let getDrawer = () => (
      <Drawer open={this.state.open} style={style.drawer}>
        <AppBar title="Abibao" iconElementLeft={iconClose()} onLeftIconButtonTouchTap={this.handleToggle} />
        <MenuItem onTouchTap={this.handleSurveysWall}>Surveys wall</MenuItem>
        <MenuItem>My surveys</MenuItem>
        <MenuItem onTouchTap={this.handleLogout}>Logout</MenuItem>
      </Drawer>
    )
    if (this.state.accessToken === null) {
      getDrawer = () => (
        <Drawer open={this.state.open} style={style.drawer}>
          <AppBar title="Abibao" iconElementLeft={iconClose()} onLeftIconButtonTouchTap={this.handleToggle} />
        </Drawer>
      )
    }
    // renderer
    const renderer = () => (
      <MuiThemeProvider>
        <Paper style={style.papers.content} zDepth={0}>
          <AppBar title="Abibao" onLeftIconButtonTouchTap={this.handleToggle} iconElementRight={iconNetwork()} />
          {getDrawer()}
          {this.props.children}
        </Paper>
      </MuiThemeProvider>
    )
    return renderer()
  }
}

export default App
