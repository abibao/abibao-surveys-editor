import React from 'react'
import Reflux from 'reflux'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

class App extends Reflux.Component {
  componentDidMount () {
  }
  constructor (props) {
    super(props)
    this.state = {}
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
