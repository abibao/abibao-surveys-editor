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
  const individual = message.individual
  let basename = path.basename(individual, '.yml')
  let dirpath = path.resolve('./batchs/collector/rethinkdb/surveys')
  let patterns = dirpath + '/**/' + basename + '/*.yml'
  let surveys = glob.sync(patterns, {
    nodir: false,
    dot: true
  })
  console.log('individual:', basename, 'surveys:', surveys.length)
  let individualContent = YAML.load(individual)
  _.map(surveys, (survey) => {
    let surveyContent = YAML.load(survey)
    individualContent.anwers = _.merge(individualContent.anwers, surveyContent.answers)
    let year = new Date(individualContent.createdAt).getUTCFullYear()
    let month = new Date(individualContent.createdAt).getUTCMonth()
    let day = new Date(individualContent.createdAt).getUTCDate()
    fse.ensureDirSync(path.resolve(exportPath, year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2)))
    fse.writeFileSync(path.resolve(exportPath, year.toString(), ('0' + (month + 1)).slice(-2), ('0' + day).slice(-2), individualContent.email + '.yml'), YAML.stringify(individualContent, 5))
    console.log('...', surveyContent.id, Object.keys(surveyContent.answers).length)
  })
}
