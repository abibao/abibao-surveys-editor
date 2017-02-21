// react
import React from 'react'
import Reflux from 'reflux'
import {NotificationStack} from 'react-notification'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'

// store
import ApplicationStore from '../stores/ApplicationStore'

// actions
import ApplicationActions from '../actions/ApplicationActions'

// styles
import Colors from '../colors'
const styles = {
  loader: {
    container: {
      display: 'flex',
      background: Colors.backgroundLight,
      width: '100%',
      height: '100%'
    },
    box: {
      padding: '2rem',
      margin: 'auto',
      width: '320px',
      marginTop: '50vh',
      transform: 'translateY(-50%)',
      textAlign: 'center'
    },
    progress: {
      margin: 'auto',
      width: '120px'
    }
  }
}

class App extends Reflux.Component {
  componentDidMount () {
    console.log('App', 'componentDidMount')
  }
  componentWillUnmount () {
    console.log('App', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
    // console.log('App', 'componentDidUpdate')
  }
  constructor (props) {
    console.log('App', 'constructor')
    super(props)
    this.state = {}
    this.store = ApplicationStore
    this.deleteNotification = (notification) => {
      ApplicationActions.removeNotification(notification.key)
    }
  }
  render () {
    let loader = () => (
      <div style={styles.loader.container}>
        <Paper style={styles.loader.box}>
          <h2>{this.state.loader.message}</h2>
          <CircularProgress color={Colors.primary} style={styles.loader.progress} size={120} thickness={6} />
        </Paper>
      </div>
    )
    let renderer = () => (
      <div>
        {this.props.children}
      </div>
    )
    return (
      <MuiThemeProvider>
        <div>
          {(this.state.loader.visible) ? loader() : renderer()}
          <NotificationStack
            notifications={this.state.notifications}
            onDismiss={notification => this.deleteNotification(notification)} />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
