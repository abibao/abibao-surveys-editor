// react
import Reflux from 'reflux'

const ReaderActions = Reflux.createActions([
  'networkConnect',
  'networkDisconnect',
  'readerInitialize',
  'controlMinimum',
  'controlSecurity',
  'affectSurvey',
  'answerSurvey',
  'completeSurvey',
  'getScreenComplete'
])

export default ReaderActions
