const glob = require('glob')
const path = require('path')
const _ = require('lodash')
const YAML = require('yamljs')
const async = require('async')
// const fse = require('fs-extra')

// STEP 01

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

// STEP 02

const cargoStep2 = async.cargo(function (tasks, callback) {
  for (var i = 0; i < tasks.length; i++) {
    let individual = tasks[i]
    let basename = path.basename(individual, '.yml')
    let dirpath = path.resolve('./batchs/prod/rethinkdb/surveys')
    let patterns = dirpath + '/**/' + basename + '/*.yml'
    let surveys = glob.sync(patterns, {
      nodir: false,
      dot: true
    })
    let individualContent = YAML.load(individual)
    console.log(individualContent.email, surveys.length)
    callback()
    /* _.map(surveys, (survey) => {
      let individualContent = YAML.load(individual)
      let surveyContent = YAML.load(survey)
      individualContent.answers = _.merge(surveyContent.answers)
      fse.writeFileSync(individual, YAML.stringify(individualContent, 5))
      console.log('...', basename, surveyContent.id)
    }) */
  }
})
cargoStep2.drain = () => {
  console.log('STEP 02', 'done')
}

const step02 = () => {
  _.map(individuals, (individual) => {
    cargoStep2.push(individual)
  })
}

// START

step02()
