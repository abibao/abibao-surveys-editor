/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import Sortable from 'sortablejs'
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
    return (
      <div className="sortablejs-container">
        <ul id="sortDrop" className="sortablejs-drop" />
        <ul id="sortDrag" className="sortablejs-drag">
          {question.choicesValues.map((item) => (
            <li data-value={item.value} data-text={item.text} key={item.value}>{item.text}</li>
          ))}
        </ul>
      </div>
    )
  },
  afterRender: function (question, el) {
    var source = document.getElementById('sortDrag')
    var target = document.getElementById('sortDrop')
    Sortable.create(source, {
      animation: 150,
      group: {
        name: 'top3',
        pull: true,
        put: true
      }
    })
    Sortable.create(target, {
      animation: 150,
      group: {
        name: 'top3',
        pull: true,
        put: true
      },
      onSort: function (e) {
        var result = []
        for (var i = 0; i < e.to.children.length; i++) {
          result.push(e.to.children[i].dataset.value)
        }
        console.log(result)
        question.value = result
      }
    })
  }
}

export default SortableList
