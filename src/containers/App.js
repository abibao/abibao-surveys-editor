// react
import React from 'react'
import Reflux from 'reflux'

// material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// stores
import AppStore from '../stores/AppStore'

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
    this.store = AppStore
  }
  render () {
    let renderer = () => (
      <MuiThemeProvider>
        {this.props.children}
      </MuiThemeProvider>
    )
    return renderer()
  }
}

export default App
