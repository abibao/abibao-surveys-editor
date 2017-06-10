const fse = require('fs-extra')
const path = require('path')
const YAML = require('yamljs')
const pg = require('pg')
const map = require('lodash').map

fse.ensureDirSync(path.resolve('./batchs/collector/postgres/answers'))
fse.emptyDirSync(path.resolve('./batchs/collector/postgres/answers'))
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
  console.log('dump answers in progress...', offset)
  client.query('SELECT * FROM answers WHERE answers."deletedAt" IS NULL LIMIT 1000 OFFSET $1::integer', [offset], (error, result) => {
    // on error
    if (error) {
      console.log('...', 'error (1)')
      client.end(() => {
        console.log(error)
        return process.exit(1)
      })
    } else {
      map(result.rows, (item) => {
        let year = new Date(item.createdAt).getUTCFullYear()
        let month = new Date(item.createdAt).getUTCMonth()
        let day = new Date(item.createdAt).getUTCDate()
        delete item.deletedAt
        let filepath = ''
        // by question
        filepath = path.resolve('./batchs/collector/postgres/answers', year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2), item.id + '.yml')
        fse.ensureFileSync(filepath)
        fse.writeFileSync(filepath, YAML.stringify(item, 5))
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
