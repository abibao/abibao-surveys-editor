const fse = require('fs-extra')
const path = require('path')
const glob = require('glob')
const YAML = require('yamljs')
const map = require('lodash').map

let stats = {
  ABIBAO_ANSWER_ASKING_CGU: {},
  ABIBAO_ANSWER_FONDAMENTAL_GENDER: {},
  ABIBAO_ANSWER_FONDAMENTAL_AGE: {},
  ABIBAO_ANSWER_FONDAMENTAL_DEPARTEMENT: {},
  ABIBAO_ANSWER_FONDAMENTAL_CSP: {},
  ABIBAO_ANSWER_CHARITY_SENSIBILITY: {}
}

let questions = Object.keys(stats)

map(questions, (question) => {
  let dirpath = path.resolve('./batchs/export/answers/c73cf80b-a6c1-45f1-8c8c-c8eb21b1788b', question)
  let patternPath = dirpath + '/**/*.yml'
  let patternFiles = glob.sync(patternPath, {
    nodir: true,
    dot: true
  })
  console.log(question, patternFiles.length)
  stats[question].count = patternFiles.length
  map(patternFiles, (file) => {
    let content = YAML.load(file)
    if (!stats[question][content.answer]) {
      stats[question][content.answer] = 0
    }
    stats[question][content.answer] += 1
  })
})

let filepath = path.resolve('./batchs/export/answers/c73cf80b-a6c1-45f1-8c8c-c8eb21b1788b/stats.yml')
fse.ensureFileSync(filepath)
fse.writeFileSync(filepath, YAML.stringify(stats, 5))
