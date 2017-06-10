var Promise = require('bluebird')
var async = require('async')
var path = require('path')
var fse = require('fs-extra')
var _ = require('lodash')
var ProgressBar = require('progress')
var colors = require('colors/safe')

var sourceValue = null
var envValue = null

var program = require('commander')
program
  .arguments('<source> [env]')
  .action((source, env) => {
    sourceValue = source
    envValue = env
  })

program.parse(process.argv)

console.log('')
console.log(colors.green.bold('***************************************************'))
console.log(colors.green.bold('rethinkdb export table(s) to file(s)'))
console.log(colors.green.bold('***************************************************'))
console.log(colors.yellow.bold('table(s):'), sourceValue || 'no table given!')
console.log(colors.yellow.bold('environment:'), envValue || 'no environment given!')
console.log(colors.green.bold('***************************************************'))

if (!sourceValue || !envValue) {
  process.exit(1)
}

if (sourceValue === 'all') {
  sourceValue = 'administrators,individuals,entities,campaigns,campaigns_items,campaigns_items_choices,surveys'
}

// load environnement configuration
const YAML = require('yamljs')
let conf = YAML.load(path.resolve('./batchs/dump.yml'))

// rethinkdb
var options = {
  host: conf.rethinkdb.host,
  port: conf.rethinkdb.port,
  db: conf.rethinkdb.database,
  user: conf.rethinkdb.user,
  password: conf.rethinkdb.password,
  silent: true
}
console.log(options)
var r = require('thinky')(options).r

// select files cache
var cacheDir = path.resolve(__dirname, 'collector/rethinkdb')
fse.ensureDirSync(cacheDir)
fse.emptyDirSync(cacheDir)

// initialize progress bar
var total = 0
var promises = []
var tables = sourceValue.split(',')
_.map(tables, (table) => {
  promises.push(r.table(table).count())
})
Promise.all(promises)
  .then((result) => {
    _.map(result, (count) => {
      total += count
    })
    run()
  })
  .catch(function (error) {
    console.log('\n', colors.bgRed.bold(' ERROR! '))
    console.log(colors.gray(error), '\n')
    process.exit(1)
  })

// handler
var execBatch = (table, skip, limit, bar, callback) => {
  r.table(table).skip(skip).limit(limit)
    .then(function (result) {
      var items = result
      async.mapSeries(items, function (item, next) {
        var dir = path.resolve(cacheDir, table)
        fse.ensureDirSync(dir)
        var filepath = path.resolve(dir, item.id + '.yml')
        if (table === 'individuals') {
          let year = new Date(item.createdAt).getUTCFullYear()
          let month = new Date(item.createdAt).getUTCMonth()
          let day = new Date(item.createdAt).getUTCDate()
          filepath = path.resolve(dir, year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2), item.id + '.yml')
          fse.ensureFileSync(filepath)
        }
        if (table === 'surveys') {
          let year = new Date(item.createdAt).getUTCFullYear()
          let month = new Date(item.createdAt).getUTCMonth()
          let day = new Date(item.createdAt).getUTCDate()
          filepath = path.resolve(dir, year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2), item.individual, item.id + '.yml')
          fse.ensureFileSync(filepath)
        }
        fse.writeFileSync(filepath, YAML.stringify(item, 5))
        bar.tick()
        next()
      }, function (err) {
        if (err) { return callback() }
        r.table(table).count().then(function (count) {
          if (skip + limit < count) {
            execBatch(table, skip + limit, limit, bar, callback)
          } else {
            callback()
          }
        })
      })
    })
    .catch(function (error) {
      callback(error)
    })
}

// run the script
var run = () => {
  var bar = new ProgressBar('progress [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total
  })
  async.mapSeries(tables, function (table, next) {
    execBatch(table, 0, 100, bar, next)
  }, function (error, results) {
    if (error) {
      console.log('\n', colors.bgRed.bold(' ERROR! '), '\n')
      console.log(error)
      process.exit(1)
    } else {
      console.log('\n', colors.bgGreen.bold(' DONE! '), '\n')
      process.exit(0)
    }
  })
}
