var imagepickerWidget = {
  name: 'imagepicker',
  isFit : function (question) { return question['renderAs'] === 'imagepicker'; },
  isDefaultRender: true,
  afterRender: function (question, el) {
  }
}
