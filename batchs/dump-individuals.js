const fse = require('fs-extra')
const path = require('path')
const YAML = require('yamljs')
const pg = require('pg')
const map = require('lodash').map
const glob = require('glob')

fse.ensureDirSync(path.resolve('./batchs/export/individuals'))
let conf = YAML.load(path.resolve('./batchs/dump.yml'))

const pool = new pg.Pool(conf.postgres)
let client = false

pool.connect((error, result, done) => {
  if (error) {
    console.log(error)
    return process.exit(1)
  }
  console.log('connected to postgres')
  client = result
  dumpAnswers(0)
})

const dumpAnswers = (offset) => {
  console.log('dump individuals in progress...', offset)
  client.query('SELECT * FROM individuals WHERE individuals."deletedAt" IS NULL LIMIT 1000 OFFSET $1::integer', [offset], (error, result) => {
    // on error
    if (error) {
      console.log('...', 'error (1)')
      client.end(() => {
        console.log(error)
        return process.exit(1)
      })
    } else {
      let maxRows = result.rows.length
      map(result.rows, (item) => {
        console.log('...', maxRows)
        let retinkdbPath = path.resolve('./batchs/prod/rethinkdb/individuals')
        let rethinkdbPattern = retinkdbPath + '/**/' + item.email + '.yml'
        let rethinkdbIndividual = glob.sync(rethinkdbPattern, {
          nodir: false,
          dot: true
        })
        if (rethinkdbIndividual.length === 1) {
          let content = YAML.load(rethinkdbIndividual[0])
          item.updatedAt = content.createdAt
          item.createdAt = item.updatedAt
        }
        let year = new Date(item.updatedAt).getUTCFullYear()
        let month = new Date(item.updatedAt).getUTCMonth()
        let day = new Date(item.updatedAt).getUTCDate()
        delete item.deletedAt
        let filepath = ''
        // by question
        filepath = path.resolve('./batchs/export/individuals', year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2), item.urn + '.yml')
        fse.ensureFileSync(filepath)
        fse.writeFileSync(filepath, YAML.stringify(item, 5))
        maxRows -= 1
      })
      if (result.rows.length !== 0) {
        offset += 999
        dumpAnswers(offset)
      } else {
        client.end(() => {
          console.log('disconnected from postgres')
          return process.exit(1)
        })
      }
    }
  })
}
