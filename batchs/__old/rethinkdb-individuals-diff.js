const glob = require('glob-promise')
const path = require('path')
const YAML = require('yamljs')
const async = require('async')
const _ = require('lodash')

let individualsFromRethink = []
let individualsFromPostgres = []

let cargoRDone = false
const cargoR = async.cargo(function (tasks, callback) {
  for (var i = 0; i < tasks.length; i++) {
    let content = YAML.load(tasks[i].file)
    individualsFromRethink.push(content.email)
  }
  callback()
}, 2)

let cargoPDone = false
const cargoP = async.cargo(function (tasks, callback) {
  for (var i = 0; i < tasks.length; i++) {
    let content = YAML.load(tasks[i].file)
    individualsFromPostgres.push(content.email)
  }
  callback()
}, 2)

cargoR.drain = () => {
  cargoRDone = true
  diff()
}
cargoP.drain = () => {
  cargoPDone = true
  diff()
}

let dirpath = path.resolve('./batchs/prod/rethinkdb/individuals')
let patterns = dirpath + '/**/*.yml'
let rethinkdbFiles = glob.sync(patterns, {
  nodir: false,
  dot: true
})
console.log('files from rethinkdb:', rethinkdbFiles.length)

dirpath = path.resolve('./batchs/export/individuals')
patterns = dirpath + '/**/*.yml'
let postgresFiles = glob.sync(patterns, {
  nodir: false,
  dot: true
})
console.log('files from postgres:', postgresFiles.length)

async.mapLimit(rethinkdbFiles, 10, (file, next) => {
  cargoR.push({file}, next)
})
async.mapLimit(postgresFiles, 10, (file, next) => {
  cargoP.push({file}, next)
})

let emails = []
const diff = () => {
  if (cargoRDone === true && cargoPDone === true) {
    console.log('DONE')
    console.log('emails from rethinkdb:', individualsFromRethink.length)
    console.log('emails from postgres:', individualsFromPostgres.length)
    emails = _.pullAllWith(individualsFromRethink, individualsFromPostgres, _.isEqual)
    console.log(emails)
  }
}
