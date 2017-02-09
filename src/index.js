import React from 'react'
import {render} from 'react-dom'

import {Router, Route, browserHistory, IndexRoute} from 'react-router'

import Feathers from './libs/Feathers'

import App from './containers/App'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Campaigns from './pages/Campaigns'

import './index.css'

Feathers.io.on('connect', () => {
  setTimeout(() => {
    console.log('Feathers is connected')
    let requireAuth = function (nextState, replace) {
      // initialize
      Feathers.authenticate().then((result) => {
        console.log('requireAuth', 'succeed')
      }).catch(() => {
        console.log('requireAuth', 'failed')
        browserHistory.push('/login')
      })
    }
    // renderer
    render((
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Homepage} onEnter={requireAuth} />
          <Route path="login" component={Login} />
          <Route path="campaigns" component={Campaigns} onEnter={requireAuth} />
        </Route>
      </Router>
    ), document.getElementById('root'))
  }, 250)
})
