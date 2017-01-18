<editor>

  <div id="surveyEditorContainer"></div>

  <script>
    /*global SurveyEditor*/
    'use strict'

    this.editorOptions = {showEmbededSurveyTab: true}

    this.on('*', (event) => {
      console.log(event)
    })

    this.on('mount', () => {
      this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', this.editorOptions)
      this.editor.saveSurveyFunc = () => {

      }
    })

  </script>

</editor>
