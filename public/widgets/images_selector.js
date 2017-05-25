var imagepickerWidget = {
  name: 'images_selector',
  isFit : function (question) { return question['renderAs'] === 'images_selector'; },
  isDefaultRender: true,
  afterRender: function (question, el) {
  }
}
