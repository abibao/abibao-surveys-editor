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

// reader
import Reader from './pages/reader/Reader'

// admin
import PageNotFound from './pages/admin/PageNotFound'
import Login from './pages/admin/Login'
import Campaigns from './pages/admin/Campaigns'
import Mailings from './pages/admin/Mailings'
import Editor from './pages/admin/Editor'

const routerAdmin = (
  <Router history={browserHistory}>
    <Route path="admin/login" component={Login} />
    <Route path="admin/campaigns" component={Campaigns} />
    <Route path="admin/mailings" component={Mailings} />
    <Route path="admin/campaigns/:id/editor" component={Editor} />
    <Route path="*" component={PageNotFound} />
  </Router>
)

const routerReader = (
  <Router history={browserHistory}>
    <Route path="reader/:id" component={Reader} />
    <Route path="*" component={PageNotFound} />
  </Router>
)

const routerError = (
  <Router history={browserHistory}>
    <Route path="*" component={PageNotFound} />
  </Router>
)

let routerCurrent = routerError

if (window.location.pathname.search('reader') === 1) {
  routerCurrent = routerReader
}
if (window.location.pathname.search('admin') === 1) {
  routerCurrent = routerAdmin
}

render(routerCurrent, document.getElementById('root'))
