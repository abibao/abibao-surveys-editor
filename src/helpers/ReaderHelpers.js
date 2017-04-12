class ReaderHelpers {
  constructor (context) {
    this.context = context
  }
  initialize () {
    console.log('ReaderHelpers', 'initialize')
    this.context.setState({initialized: true, loader: {
      visible: true,
      message: 'Chargement campagne en cours...'
    }})
  }
}

export default ReaderHelpers
