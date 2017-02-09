import React from 'react'
import Reflux from 'reflux'

import {grey300, orange800, white} from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

import AppStore from './../stores/AppStore'

const styles = {
  labelStyle: {
    login: {
      fontWeight: 'bold'
    }
  },
  buttonStyle: {
    login: {
      margin: 'auto'
    }
  },
  underlineFocusStyle: {
    borderColor: orange800
  },
  container: {
    display: 'flex',
    background: grey300,
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

class Login extends Reflux.Component {
  componentDidMount () {
  }
  componentWillUnmount () {
  }
  componentDidUpdate (prevProps, prevState) {
    if (!prevState.networkOnline && this.state.networkOnline) {
      this.setState({loading: false})
    }
    if (prevState.networkOnline && !this.state.networkOnline) {
      this.setState({loading: true})
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      email: 'administrator@abibao.com',
      password: ''
    }
    this.stores = [AppStore]
    this.handleSubmit = () => {
      this.setState({loading: true})
      const store = this.stores[0]
      store.login(this.state)
    }
    this.handleRequestClose = () => {
      this.setState({
        loading: false,
        error: {
          open: false,
          message: ''
        }
      })
    }
  }
  render () {
    let loader = () => (
      <Paper style={styles.container}>
        <Paper style={styles.box}>
          <h2>Chargement en cours...</h2>
          <CircularProgress color={orange800} style={styles.progress} size={120} thickness={6} />
        </Paper>
        <Snackbar
          open={this.state.error.open}
          message={this.state.error.message}
          action="Fermer"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </Paper>
    )
    let renderer = () => (
      <Paper style={styles.container}>
        <Paper style={styles.box}>
          <img src="images/abibao-logo-gris-jaune.png" role="presentation" />
          <br /><br />
          <TextField underlineFocusStyle={styles.underlineFocusStyle} type="email" fullWidth hintText="Email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} /><br />
          <TextField underlineFocusStyle={styles.underlineFocusStyle} type="password" fullWidth hintText="Mot de passe" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} /><br />
          <br /><br />
          <RaisedButton label="S'indentifer" onTouchTap={this.handleSubmit} backgroundColor={orange800} labelColor={white} labelStyle={styles.labelStyle.login} buttonStyle={styles.buttonStyle.login} />
        </Paper>
      </Paper>
    )
    // renderer
    if (this.state.loading === true) {
      return loader()
    } else {
      return renderer()
    }
  }
}

export default Login
