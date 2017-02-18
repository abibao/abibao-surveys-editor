// react
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'

// feathers
import Feathers from './libs/Feathers'

// components
import App from './containers/App'

// pages: admin
import AdminLogin from './pages/admin/Login'
import AdminHomepage from './pages/admin/Homepage'
import AdminCampaigns from './pages/admin/Campaigns'
import AdminEntities from './pages/admin/Entities'
import AdminReader from './pages/admin/Reader'
import AdminEditor from './pages/admin/Editor'

// styles
import './index.css'

Feathers.io.on('connect', () => {
  setTimeout(() => {
    console.log('Feathers is connected')
    let requireAuth = function (nextState, replace) {
      // initialize
      Feathers.authenticate().then((result) => {
        console.log('requireAuth', 'succeed')
        const regex = /^\/admin/g
        const str = browserHistory.getCurrentLocation().pathname
        let m = regex.test(str)
        if (m === true) {
          // browserHistory.push('/admin/campaigns')
        }
      }).catch(() => {
        console.log('requireAuth', 'failed')
        browserHistory.push('/admin/login')
      })
    }
    render((
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <Route path="admin/login" component={AdminLogin} />
          <Route path="admin" component={AdminHomepage} onEnter={requireAuth}>
            <Route path="campaigns" component={AdminCampaigns} />
            <Route path="entities" component={AdminEntities} />
            <Route path="editor/:id" component={AdminEditor} />
            <Route path="reader/:id" component={AdminReader} />
          </Route>
        </Route>
      </Router>
    ), document.getElementById('root'))
  }, 250)
})
