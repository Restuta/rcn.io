import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'

//inline arrays will cause a re-render
const sizes1 = [1, 1, 2, 2, 2, 3, 3]
const sizes2 = [2, 2, 2, 2, 2, 2, 2]
const sizes3 = [1, 1, 1, 1, 2, 4, 4]
const sizes4 = [1, 1, 1, 2, 3, 3, 3]

export default class Cal extends Component {
  render() {

    const {containerWidth} = this.props

    return (
      <div>
        <Calendar calendarId="cal-test-1"
          region="NCNCA" name="Calendar" year={2016} timeZone="America/Los_Angeles"
          containerWidth={containerWidth}
          weekdaysSizes={sizes1}/>
        <Calendar calendarId="cal-test-2"
          region="NCNCA" name="Calendar" year={2016} timeZone="America/Los_Angeles"
          containerWidth={containerWidth}
          weekdaysSizes={sizes2}/>
        <Calendar calendarId="cal-test-3"
          region="NCNCA" name="Calendar" year={2016} timeZone="America/Los_Angeles"
          containerWidth={containerWidth}
          weekdaysSizes={sizes3}/>
        <Calendar calendarId="cal-test-4"
          region="NCNCA" name="Calendar" year={2016} timeZone="America/Los_Angeles"
          containerWidth={containerWidth}
          weekdaysSizes={sizes4}/>
      </div>
    )
  }
}
