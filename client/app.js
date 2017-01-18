/*global riot*/
'use strict'

// vendors
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'

// modules
import 'riot-routehandler'
import 'survey-knockout/dist/survey.ko.js'
import 'surveyjs-editor/dist/surveyeditor.css'

// abibao
import './pages/editor.tag'

// router
var logger = (ctx, next, page) => {
  console.log(ctx.canonicalPath)
  next()
}
const routes = [
  {route: '*', use: logger},
  {route: '/editor/:id', tag: 'editor'}
]

// run application
riot.mount('routehandler', {routes, options: {hashbang: false}})
