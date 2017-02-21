// react
import React from 'react'
import Reflux from 'reflux'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'

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
    console.log('App', 'componentDidUpdate')
  }
  constructor (props) {
    console.log('App', 'constructor')
    super(props)
    this.state = {}
    this.store = ApplicationStore
  }
  render () {
    let loader = () => (
      <MuiThemeProvider>
        <div>
          <div style={styles.loader.container}>
            <Paper style={styles.loader.box}>
              <h2>{this.state.loader.message}</h2>
              <CircularProgress color={Colors.primary} style={styles.loader.progress} size={120} thickness={6} />
            </Paper>
          </div>
          <Snackbar
            open={this.state.snack.open}
            message={this.state.snack.message}
            action="Fermer"
            autoHideDuration={3000}
            onRequestClose={ApplicationActions.closeErrorMessage} />
        </div>
      </MuiThemeProvider>
    )
    let renderer = () => (
      <MuiThemeProvider>
        <div>
          {this.props.children}
          <Snackbar
            open={this.state.snack.open}
            message={this.state.snack.message}
            action="Fermer"
            autoHideDuration={3000}
            onRequestClose={ApplicationActions.closeErrorMessage} />
        </div>
      </MuiThemeProvider>
    )
    if (this.state.loader.visible) {
      return loader()
    }
    return renderer()
  }
}

export default App
