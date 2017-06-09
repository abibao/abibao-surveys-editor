const fse = require('fs-extra')
const path = require('path')
const glob = require('glob-promise')
const YAML = require('yamljs')
const _ = require('lodash')
const async = require('async')

const campaign = 'c73cf80b-a6c1-45f1-8c8c-c8eb21b1788b'

let questionpath = path.resolve('./batchs/export/answers', campaign)
let patternQuestions = glob.sync(questionpath + '/*', {
  nodir: false,
  dot: true,
  ignore: [questionpath + '/stats.yml']
})

let stats = {}
_.map(patternQuestions, (item) => {
  stats[path.basename(item)] = {}
})

let questions = Object.keys(stats)

const cargo = async.cargo(function (tasks, callback) {
  for (var i = 0; i < tasks.length; i++) {
    let content = YAML.load(tasks[i].file)
    if (!stats[tasks[i].question][content.answer]) {
      stats[tasks[i].question][content.answer] = 0
    }
    stats[tasks[i].question][content.answer] += 1
  }
  callback()
}, 2)

console.log('START PROCESS')
async.mapLimit(questions, 10, (question, nextQuestion) => {
  let dirpath = path.resolve('./batchs/export/answers', campaign, question)
  let patternPath = dirpath + '/**/*.yml'
  let patternFiles = glob.sync(patternPath, {
    nodir: true,
    dot: true
  })
  console.log('...', question, patternFiles.length)
  async.mapSeries(patternFiles, (file, nextPattern) => {
    cargo.push({file, question}, function () {
    })
    nextPattern()
  }, () => {
    nextQuestion()
  })
}, () => {
  console.log('ALL PROCESSES DONE')
  let filepath = path.resolve('./batchs/export/answers', campaign, 'stats.yml')
  fse.ensureFileSync(filepath)
  fse.writeFileSync(filepath, YAML.stringify(stats, 5))
})
