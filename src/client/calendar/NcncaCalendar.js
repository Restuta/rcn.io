import React from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import Grid from 'styles/grid'

const sizesMaxWeekends = [1, 1, 1, 1, 2, 4, 4]
const sizesEqual = [2, 2, 2, 2, 2, 2, 2]

//if starts from 'cal-' we assume it's a valid id, otherwise it's a "name"
//so by convention we prefix it with "cal-"

/* TODO bc: make sure this is actually good approach
  - ids MUST be consistent and start from 'cal-'
  - we SHOULD support names like "NCNCA-2016" to show this in  the URL
  - we COULD map names to ids and just do lookup (maintain lookup table)
  - names MUST be unique
*/
const getCalendarId = slugFromRouteParams =>
  ((slugFromRouteParams || '').startsWith('cal-')
    ? slugFromRouteParams
    : 'cal-' + slugFromRouteParams)

export default class NcncaCalendar extends Component {
  render() {
    const { containerWidth } = this.props
    const calendarId = getCalendarId(this.props.params.calendarId)
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
          calendarId={calendarId}
          containerWidth={containerWidth}
          weekdaysSizes={weekdaysSizes}
          />
      </div>
    )
  }
}
