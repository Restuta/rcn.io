import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import {roadEvents as events} from 'temp/events.js'

export default class Cal extends Component {
  render() {
    return (
      <div>
        <Calendar calendarId="cal-test-1"
          location="NCNCA" name="Calendar" year={2016} timeZone="America/Los_Angeles"
          events={events}
          containerWidth={this.props.containerWidth}
          weekdaysSizes={[1, 1, 2, 2, 2, 3, 3]}/>
        <Calendar calendarId="cal-test-2"
          location="NCNCA" name="Calendar" year={2016} timeZone="America/Los_Angeles"
          events={events}
          containerWidth={this.props.containerWidth}
          weekdaysSizes={[2, 2, 2, 2, 2, 2, 2]}/>
        <Calendar calendarId="cal-test-3"
            location="NCNCA" name="Calendar" year={2016} timeZone="America/Los_Angeles"
            events={events}
            containerWidth={this.props.containerWidth}
            weekdaysSizes={[1, 1, 1, 1, 2, 4, 4]}/>
        <Calendar calendarId="cal-test-4"
          location="NCNCA" name="Calendar" year={2016} timeZone="America/Los_Angeles"
          events={events}
          containerWidth={this.props.containerWidth}
          weekdaysSizes={[1, 1, 1, 2, 3, 3, 3]}/>
      </div>
    )
  }
}
