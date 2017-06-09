const url = 'amqp://guest:guest@localhost:5672'
const bus = require('servicebus').bus({url})

bus.on('error', (error) => {
  console.log(error)
  process.exit(1)
})

bus.on('ready', () => {
  bus.send('BATCH_ASSEMBLE_RUN', {})
  console.log('Message sended, batch has just started')
})
