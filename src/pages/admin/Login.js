// react
import React from 'react'
import Reflux from 'reflux'

// material-ui
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

// store
import ApplicationStore from '../../stores/ApplicationStore'

// styles
import Colors from '../../colors'
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
    borderColor: Colors.primary
  },
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

class Login extends Reflux.Component {
  componentDidMount () {
    console.log('Login', 'componentDidMount')
  }
  componentWillUnmount () {
    console.log('Login', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
    console.log('Login', 'componentDidUpdate')
  }
  constructor (props) {
    console.log('Login', 'constructor')
    super(props)
    this.state = {
      email: 'administrator@abibao.com',
      password: ''
    }
    this.store = ApplicationStore
    this.handleSubmit = () => {
    }
  }
  render () {
    let renderer = () => (
      <div style={styles.container}>
        <Paper style={styles.box}>
          <img src="../../images/abibao-logo-gris-jaune.png" role="presentation" />
          <br /><br />
          <TextField underlineFocusStyle={styles.underlineFocusStyle} type="email" fullWidth hintText="Email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} /><br />
          <TextField underlineFocusStyle={styles.underlineFocusStyle} type="password" fullWidth hintText="Mot de passe" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} /><br />
          <br /><br />
          <RaisedButton label="S'indentifer" onTouchTap={this.handleSubmit} backgroundColor={Colors.primary} labelColor={Colors.white} labelStyle={styles.labelStyle.login} buttonStyle={styles.buttonStyle.login} />
        </Paper>
      </div>
    )
    // renderer
    if (this.state.loading === true) {
      return null
    }
    return renderer()
  }
}

export default Login
