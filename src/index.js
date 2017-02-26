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

import SemanticAdmin from './pages/SemanticAdmin'
import PageNotFound from './pages/semantic-admin/PageNotFound'
import Login from './pages/semantic-admin/Login'
import Campaigns from './pages/semantic-admin/Campaigns'
import Editor from './pages/semantic-admin/Editor'
import Reader from './pages/semantic-admin/Reader'

render((
  <Router history={browserHistory}>
    <Route path="admin/login" component={Login} />
    <Route path="admin" component={SemanticAdmin}>
      <Route path="campaigns" component={Campaigns} />
      <Route path="editor/:id" component={Editor} />
      <Route path="reader/:id" component={Reader} />
    </Route>
    <Route path="*" component={PageNotFound} />
  </Router>
), document.getElementById('root'))

/** <Route path="admin/login" component={AdminLogin} />
<Route path="admin" component={AdminHomepage} onEnter={requireAuth}>
  <Route path="campaigns" component={AdminCampaigns} />
  <Route path="entities" component={AdminEntities} />
</Route> **/
