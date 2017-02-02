import React from 'react'
import { render } from 'react-dom'

import {Router, Route, browserHistory} from 'react-router'

import Feathers from './libs/Feathers'

import App from './containers/App'
import Login from './pages/Login'
import SurveysWall from './pages/SurveysWall'

import './index.css'

const NoMatch = React.createClass({
  render () {
    return (
      <div>
        <h1>404/ERROR</h1>
      </div>
    )
  }
})

let requireAuth = function (nextState, replace) {
  Feathers.authenticate().then(console.log).catch(() => {
    browserHistory.push('/login')
  })
}

let requireNotAuth = (nextState, replace) => {
  Feathers.authenticate().then(() => {
    browserHistory.push('/login')
  }).catch(() => {})
}

let redirectLogin = (nextState, replace) => {
  if (nextState.location.pathname !== '/') { return false }
  Feathers.authenticate().then(console.log).catch(() => {
    browserHistory.push('/login')
  })
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App} onEnter={redirectLogin}>
      <Route path="login" component={Login} onEnter={requireNotAuth} />
      <Route path="surveyswall" component={SurveysWall} onEnter={requireAuth} />
    </Route>
    <Route path="*" component={NoMatch} />
  </Router>
), document.getElementById('root'))
