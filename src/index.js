import React from 'react'
import { render } from 'react-dom'

import { Router, Route, browserHistory } from 'react-router'

import App from './App'
import SurveysWall from './components/SurveysWall'
import Surveys from './components/Surveys'

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

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/surveyswall" component={SurveysWall} />
      <Route path="/surveys" component={Surveys} />
    </Route>
    <Route path="*" component={NoMatch} />
  </Router>
), document.getElementById('root'))
