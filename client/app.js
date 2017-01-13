/*global SurveyEditor*/
'use strict'

import 'survey-knockout/dist/survey.ko.js'

const editorOptions = {showEmbededSurveyTab: true}
const editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions)

editor.saveSurveyFunc = () => {

}
