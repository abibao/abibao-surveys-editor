const fse = require('fs-extra')
const path = require('path')
const YAML = require('yamljs')
const pg = require('pg')
const map = require('lodash').map

fse.ensureDirSync(path.resolve('./batchs/collector/postgres/individuals'))
fse.emptyDirSync(path.resolve('./batchs/collector/postgres/individuals'))
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
  dump(0)
})

const dump = (offset) => {
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
      map(result.rows, (item) => {
        let year = new Date(item.updatedAt).getUTCFullYear()
        let month = new Date(item.updatedAt).getUTCMonth()
        let day = new Date(item.updatedAt).getUTCDate()
        let filepath = ''
        // by question
        filepath = path.resolve('./batchs/collector/postgres/individuals', year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2), item.email + '.yml')
        fse.ensureFileSync(filepath)
        fse.writeFileSync(filepath, YAML.stringify(item, 5))
      })
      if (result.rows.length !== 0) {
        offset += 999
        dump(offset)
      } else {
        client.end(() => {
          console.log('disconnected from postgres')
          return process.exit(1)
        })
      }
    }
  })
}
