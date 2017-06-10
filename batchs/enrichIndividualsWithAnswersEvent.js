const glob = require('glob-promise')
const path = require('path')
const _ = require('lodash')
const fse = require('fs-extra')
const YAML = require('yamljs')

const exportPath = path.resolve('./batchs/enrich/individuals')
fse.ensureDirSync(exportPath)
fse.emptyDirSync(exportPath)

const url = 'amqp://guest:guest@localhost:5672'
const bus = require('servicebus').bus({url})

bus.on('error', (error) => {
  console.log(error)
  process.exit(1)
})

bus.on('ready', () => {
  bus.listen('BATCH_ASSEMBLE_STEP_01', execStep01)
  bus.listen('BATCH_ASSEMBLE_STEP_02', execStep02)
  bus.listen('BATCH_ASSEMBLE_STEP_02_INDIVIDUAL', execStep02Individual)
  bus.listen('BATCH_ASSEMBLE_RUN', (message) => {
    bus.send('BATCH_ASSEMBLE_STEP_01', {})
  })
  console.log('Bus has just started')
  bus.send('BATCH_ASSEMBLE_RUN', {})
})

const execStep01 = (message) => {
  let dirpath = path.resolve('./batchs/collector/rethinkdb/individuals')
  let patterns = dirpath + '/**/*.yml'
  let individuals = glob.sync(patterns, {
    nodir: false,
    dot: true
  })
  console.log('individuals from rethinkdb:', individuals.length)
  setTimeout(() => {
    bus.send('BATCH_ASSEMBLE_STEP_02', {individuals})
  }, 2000)
}

const execStep02 = (message) => {
  _.map(message.individuals, (individual) => {
    bus.send('BATCH_ASSEMBLE_STEP_02_INDIVIDUAL', {individual})
  })
}

const execStep02Individual = (message) => {
  // load all campaigns_items_choices
  let dirpath = path.resolve('./batchs/collector/rethinkdb/campaigns_items_choices')
  let patterns = dirpath + '/**/*.yml'
  let items = glob.sync(patterns, {
    nodir: false,
    dot: true
  })
  let choices = {}
  _.map(items, (item) => {
    let basename = path.basename(item, '.yml')
    choices[basename] = YAML.load(item)
  })
  // load all campaigns_items
  dirpath = path.resolve('./batchs/collector/rethinkdb/campaigns_items')
  patterns = dirpath + '/**/*.yml'
  items = glob.sync(patterns, {
    nodir: false,
    dot: true
  })
  let questions = {}
  _.map(items, (item) => {
    let basename = path.basename(item, '.yml')
    questions[basename] = YAML.load(item)
  })
  // load all campaigns
  dirpath = path.resolve('./batchs/collector/rethinkdb/campaigns')
  patterns = dirpath + '/**/*.yml'
  items = glob.sync(patterns, {
    nodir: false,
    dot: true
  })
  let campaigns = {}
  _.map(items, (item) => {
    let basename = path.basename(item, '.yml')
    campaigns[basename] = YAML.load(item)
  })
  // start
  const individual = message.individual
  let basename = path.basename(individual, '.yml')
  dirpath = path.resolve('./batchs/collector/rethinkdb/surveys')
  patterns = dirpath + '/**/' + basename + '/*.yml'
  let surveys = glob.sync(patterns, {
    nodir: false,
    dot: true
  })
  console.log('individual:', basename, 'surveys:', surveys.length)
  let individualContent = YAML.load(individual)
  individualContent.interview = []
  _.map(surveys, (survey) => {
    let surveyContent = YAML.load(survey)
    // remplace
    _.map(Object.keys(surveyContent.answers), (key) => {
      let value = surveyContent.answers[key]
      if (_.isArray(value) === false && choices[value]) {
        individualContent.interview.push({
          campaign: campaigns[choices[value].campaign].name,
          position: questions[choices[value].item].position,
          question: questions[choices[value].item].question,
          modifiedAt: surveyContent.modifiedAt,
          answer: choices[value].text
        })
        surveyContent.answers[key] = choices[value].prefix.toUpperCase() + '_' + choices[value].suffix.toUpperCase()
      }
      if (_.isArray(value) === true) {
        surveyContent.answers[key] = _.map(value, (k) => {
          if (choices[k]) {
            individualContent.interview.push({
              campaign: campaigns[choices[k].campaign].name,
              position: questions[choices[k].item].position,
              question: questions[choices[k].item].question,
              modifiedAt: surveyContent.modifiedAt,
              answer: choices[k].text
            })
            return choices[k].prefix + '_' + choices[k].suffix
          }
        })
      }
      if (surveyContent.answers[key] === 'yes') {
        surveyContent.answers[key] = true
      }
      if (surveyContent.answers[key] === 'no') {
        surveyContent.answers[key] = false
      }
    })
    // merge
    individualContent = _.merge(individualContent, surveyContent.answers)
    // write files
    let year = new Date(individualContent.createdAt).getUTCFullYear()
    let month = new Date(individualContent.createdAt).getUTCMonth()
    let day = new Date(individualContent.createdAt).getUTCDate()
    let data = {
      email: individualContent.email,
      interview: individualContent.interview
    }
    fse.ensureDirSync(path.resolve(exportPath, 'interviews', year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2)))
    fse.writeFileSync(path.resolve(exportPath, 'interviews', year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2), data.email + '.yml'), YAML.stringify(data, 5))
    console.log('...', surveyContent.id, Object.keys(surveyContent.answers).length)
  })
}
