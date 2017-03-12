/* eslint jsx-quotes: ["error", "prefer-double"] */

// react
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'

// *************************************
// application: semantic-admin
// *************************************

import 'semantic-ui-css/semantic.css'
import './index.css'

import SemanticReader from './pages/SemanticReader'
import Reader from './pages/semantic-reader/Reader'

import SemanticAdmin from './pages/SemanticAdmin'
import PageNotFound from './pages/semantic-admin/PageNotFound'
import Login from './pages/semantic-admin/Login'
import Campaigns from './pages/semantic-admin/Campaigns'
import Editor from './pages/semantic-admin/Editor'

const routerAdmin = (
  <Router history={browserHistory}>
    <Route path="admin/login" component={Login} />
    <Route path="admin" component={SemanticAdmin}>
      <Route path="campaigns" component={Campaigns} />
      <Route path="campaigns/editor/:id" component={Editor} />
    </Route>
    <Route path="*" component={PageNotFound} />
  </Router>
)

const routerReader = (
  <Router history={browserHistory}>
    <Route path="reader" component={SemanticReader}>
      <Route path=":id" component={Reader} />
    </Route>
    <Route path="*" component={PageNotFound} />
  </Router>
)

let routerCurrent = routerAdmin
if (window.location.pathname.search('reader') === 1) {
  routerCurrent = routerReader
}

render(routerCurrent, document.getElementById('root'))
