/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import { shuffle } from 'lodash'

const ImagePickerWidget = {
  name: 'imagepicker',
  mounted: false,
  isFit: function (question) { return question['renderAs'] === 'imagepicker' },
  render: function (question) {
    if (this.mounted === false && question.choicesOrder === 'random') {
      question.choicesValues = shuffle(question.choicesValues)
    }
    this.mounted = true
    return (
      <ul className="imagepicker-box">
        {question.choicesValues.map((item) => (
          <li onClick={(e) => {
            question.value = item.value
          }} className={(question.value === item.value) ? 'imagepicker-item selected' : 'imagepicker-item'} key={item.value}><img alt="Chargement..." src={item.text} /></li>
        ))}
      </ul>
    )
  }
}

export default ImagePickerWidget
