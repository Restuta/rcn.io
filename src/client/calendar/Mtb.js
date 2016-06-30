import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import {mtbEvents} from 'temp/events.js'
import Grid from 'styles/grid'

const sizesMaxWeekends = [1, 1, 1, 1, 2, 4, 4]
const sizesEqual = [2, 2, 2, 2, 2, 2, 2]

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
          calendarId="cal-0"
          region="NorCal"
          discipline="MTB"
          name="Calendar"
          year={2016}
          timeZone="America/Los_Angeles"
          events={mtbEvents}
          containerWidth={containerWidth}
          weekdaysSizes={weekdaysSizes}
          />
      </div>
    )
  }
}
