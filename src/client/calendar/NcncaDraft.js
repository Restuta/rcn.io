import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import Grid from 'styles/grid'

const sizesMaxWeekends = [1, 1, 1, 1, 2, 4, 4]
const sizesEqual = [2, 2, 2, 2, 2, 2, 2]

// fetch('https://sheetsu.com/apis/v1.0/1c20d0db4562')
// .then(response => response.json())
// .then(result => {
//   console.info(result)
// })

// function* hello() {
//   for (let i = 0; i < 8; i++) {
//     yield i
//   }
// }
//
// console.info(hello())


export default class Mtb extends Component {
  render() {
    const { containerWidth } = this.props
    let weekdaysSizes

    if (containerWidth <= Grid.ContainerWidth.SM) {
      weekdaysSizes = sizesMaxWeekends
    } else if (containerWidth <= Grid.ContainerWidth.MD) {
      weekdaysSizes = sizesEqual
    }  else {
      weekdaysSizes = sizesEqual
    }

    return (
      <div>
        <Calendar
          calendarId="cal-ncnca-2017-draft"
          containerWidth={containerWidth}
          weekdaysSizes={weekdaysSizes}
          />
      </div>
    )
  }
}
