/* eslint jsx-quotes: ["error", "prefer-double"] */
/* eslint-disable */

import React from 'react'
import { shuffle } from 'lodash'

const ImagesSelectorWidget = {
  name: 'images_selector',
  mounted: false,
  isFit: function (question) { return question['renderAs'] === 'images_selector' },
  afterRender: function (question, el) {
    question.choicesChanged = function (item) {
      if (item.selected === undefined) {
        item.selected = true
      } else {
        item.selected = !item.selected
      }
      let result = []
      question.choicesValues.map((item) => {
        if (item.selected === true) {
          result.push(item.value)
        }
      })
      if (result.length === 0) {
        question.value = undefined
      } else {
        question.value = result
      }
      this.react.setState({reload: true})
    }
  },
  render: function (question) {
    if (this.mounted === false && question.choicesOrder === 'random') {
      question.choicesValues = shuffle(question.choicesValues)
    }
    this.mounted = true
    return (
      <ul className="imagepicker-box">
        {question.choicesValues.map((item) => (
          <li onClick={(e) => {
            question.choicesChanged(item)
          }} className={(item.selected) ? 'imagepicker-item selected' : 'imagepicker-item'} key={item.value}><img alt="Chargement..." src={item.text} /></li>
        ))}
      </ul>
    )
  }
}

export default ImagesSelectorWidget
