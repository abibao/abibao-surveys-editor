var imagepickerWidget = {
  name: 'imagepicker',
  isFit : function(question) { return question['renderAs'] === 'imagepicker'; },
  isDefaultRender: true,
  afterRender: function(question, el) {
    var $el = $(el);
    var options = $el.find('option');
    for (var i=1; i<options.length; i++) {
      options[i].dataset['imgSrc'] = options[i].text;
    }
    /* $el.imagepicker({
      hide_select : true,
      show_label  : false,
      selected: function(opts) {
        question.value = opts.picker.select[0].value;
      }
    }) */
  }
}
