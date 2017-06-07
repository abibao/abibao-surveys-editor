const glob = require('glob')
const path = require('path')
const YAML = require('yamljs')
const async = require('async')

let dirpath = path.resolve('./batchs/prod/rethinkdb/individuals')
let patterns = dirpath + '/**/*.yml'
let individuals = glob.sync(patterns, {
  nodir: false,
  dot: true
})
console.log('individuals from rethinkdb:', individuals.length)

dirpath = path.resolve('./batchs/prod/rethinkdb/surveys')
patterns = dirpath + '/**/*.yml'
let surveys = glob.sync(patterns, {
  nodir: false,
  dot: true
})
console.log('surveys from rethinkdb:', surveys.length)
