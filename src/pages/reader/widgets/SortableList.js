/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import { shuffle } from 'lodash'

const SortableList = {
  name: 'sortablejs',
  mounted: false,
  isFit: function (question) { return question['renderAs'] === 'sortablejs' },
  render: function (question) {
    if (this.mounted === false && question.choicesOrder === 'random') {
      question.choicesValues = shuffle(question.choicesValues)
    }
    this.mounted = true
    this.dropHandler = (e) => {
      console.log(e)
      e.preventDefault()
      const data = e.dataTransfer.getData('text')
      e.target.appendChild(document.getElementById(data))
    }
    this.drapoverHandler = (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }
    this.dragstartHandler = (e) => {
      console.log(e.target)
      e.dataTransfer.setData('text/plain', e.target)
      e.dropEffect = 'move'
    }
    return (
      <div className="sortablejs-container">
        <ul className="sortablejs-drop" onDrop={this.dropHandler} onDragOver={this.drapoverHandler} />
        <ul className="sortablejs-drag">
          {question.choicesValues.map((item) => (
            <li draggable="true" onDragStart={this.dragstartHandler} key={item.value}>{item.text}</li>
          ))}
        </ul>
      </div>
    )
  }
}

export default SortableList
