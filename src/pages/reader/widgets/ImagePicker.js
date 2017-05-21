/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'

const ImagePickerWidget = {
  name: 'imagepicker',
  isFit: function (question) { return question['renderAs'] === 'imagepicker' },
  render: function (question) {
    return (
      <ul className="imagepicker-box">
        {question.choicesValues.map((item) => (
          <li onClick={(e) => {
            question.value = item.value
          }} className={(question.value === item.value) ? 'imagepicker-item selected' : 'imagepicker-item'} key={item.value}><img alt="Chargement..." src={item.text} /></li>
        ))}
      </ul>
    )
  },
  afterRender: function (question, el) {
  },
  willUnmount: function (question, el) {
  }
}

export default ImagePickerWidget
