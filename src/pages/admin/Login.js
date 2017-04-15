/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import Reflux from 'reflux'

// semantic
import { Container, Button, Input, Segment, Grid, Header, Icon, Loader } from 'semantic-ui-react'

// store
import AdminStore from './../../stores/AdminStore'

// actions
import NetworkActions from './../../actions/NetworkActions'

class Login extends Reflux.Component {
  componentDidMount () {
    console.log('Login', 'componentDidMount')
  }
  componentWillUnmount () {
    console.log('Login', 'componentWillUnmount')
  }
  componentDidUpdate (prevProps, prevState) {
  }
  constructor (props) {
    console.log('Login', 'constructor')
    super(props)
    this.state = {
      email: 'administrator@abibao.com',
      password: ''
    }
    this.store = AdminStore
    this.handleSubmit = () => {
      NetworkActions.networkAuthenticate({strategy: 'local', email: this.state.email, password: this.state.password})
    }
  }
  render () {
    console.log('Login', 'render')
    let waiting = () => {
      return (
        <Container fluid className="loader-reader">
          <Loader active size="huge">En attente du serveur...</Loader>
        </Container>
      )
    }
    let renderer = () => (
      <Container fluid className="login">
        <Grid container className="login">
          <Grid.Row verticalAlign="bottom">
            <Grid.Column textAlign="center" verticalAlign="bottom">
              <Header as="h2" color="red" icon className="login">
                <Icon name="unlock alternate" size="large" />
                ABIBAO
                <Header.Subheader>PLATFORM</Header.Subheader>
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row verticalAlign="middle" color="red">
            <Grid.Column>
              <Segment loading={this.state.loader.visible} className="login">
                <Header as="h4" textAlign="left">Votre Email</Header>
                <Input fluid size="large" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} placeholder="Saisissez votre email" className="login" />
                <Header as="h4" textAlign="left">Votre mot de passe</Header>
                <Input fluid size="large" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="Saisissez votre mot de passe" type="password" className="login" />
                <br />
                <Button onClick={this.handleSubmit} size="large" className="login" color="red">Login</Button>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row verticalAlign="top">
            <Grid.Column textAlign="center" verticalAlign="top">
              <Header as="h4" color="red">
                Plateforme de gestion des campagnes de sondages
                <Header.Subheader>© 2015-2017 Abibao Inc.</Header.Subheader>
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
    if (this.state.socket === false) {
      return waiting()
    }
    return renderer()
  }
}

export default Login
