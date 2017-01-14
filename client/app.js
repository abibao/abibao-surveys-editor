/*global SurveyEditor*/
'use strict'

// vendors
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'

// modules
import 'survey-knockout/dist/survey.ko.js'
import 'surveyjs-editor/dist/surveyeditor.css'

// abibao
// import './styles/style.css'

const editorOptions = {showEmbededSurveyTab: true}
const editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions)

editor.saveSurveyFunc = () => {

}
