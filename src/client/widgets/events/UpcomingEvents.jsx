import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Event from 'calendar/events/Event.jsx'
import moment from  'moment-timezone'
import './UpcomingEvents.scss'
import classnames from 'classnames'

//sort by location function for events
const byLocation = (eventA, eventB) => {
  if (eventA.location.city > eventB.location.city) {
    return 1
  } else if (eventA.location.city < eventB.location.city) {
    return -1
  } else {
    return 0
  }
}

const getEventsAfterDate = (events, momentDate) => events.filter(x => x.date.isSameOrAfter(momentDate))
  .sort((a, b) => a.date - b.date)

// gets upcoming events for specified number of upcoming days, iterates minimal munber of times
const getUpcomingEvents = (upcomingEvents, noOfUpcomingDays) => {
  let upcomingEventsForCurrentDay = []
  let currDate

  let upcomingEventsArr = []

  for (let i = 0; i < upcomingEvents.length; i++) {
    const currEvent = upcomingEvents[i]

    //current event's date is not the same as current date
    if (currEvent.datePlain !== currDate) {
      //enough collecting events
      if (upcomingEventsArr.length === noOfUpcomingDays) {
        break
      } else if (upcomingEventsForCurrentDay.length > 0) {
        upcomingEventsArr.push(upcomingEventsForCurrentDay)
        upcomingEventsForCurrentDay = []
      }

      currDate = currEvent.datePlain
    }

    upcomingEventsForCurrentDay.push(currEvent)
  }

  return upcomingEventsArr
}

const UpcomingEventsForDay = ({today, date, events}) => {
  const weekday = moment.weekdays(date.day())


  // most of the races start not earlier then 8am and if time is not set it defautls to midnight, this would result
  // in confusing relative time calculation, e.g. at 10pm a person would see "in 2 hours"
  const dateIsSetToMidnight = date.hours() === 0
  const adjustedDate = dateIsSetToMidnight
    ? date.add(8, 'hours')
    : date

  const relativeDateStr = adjustedDate.diff(today, 'days') === 1
    ? 'Tomorrow'
    : adjustedDate.from(today)

  // const currDayIsWeekend = (weekday === 'Sunday' || weekday === 'Saturday')
  // const weekdayClass = classnames({
  //   ['non-weekend']: !currDayIsWeekend,
  //   ['weekend']: currDayIsWeekend
  // })

  return (
    <div className="upcoming-day">
      <h3 className="header-regular w-900">
        <span>{date.format('dddd, MMMM Do') + ' '}</span>
        <i className="header-secondary">
          &nbsp;({relativeDateStr})
        </i>
      </h3>
      <div className="events-container">
        {events.map(event => (
          <Event key={event.id} className="upcoming-event"
            id={event.id}
            autoHeight
            externallyControlledWidth
            showEventTypeBadge
            width={'initial'}
            event={event}/>
        ))}
      </div>
    </div>
  )
}

//layout logic
//calculate container size based on breakpoints, if >=544 i'ts two column container, so devide by 2
  //if less it's single column


class UpcomingEvents extends Component {
  render() {

    const { calendar, events } = this.props
    const NO_OF_UPCOMING_DAYS = 4

    //time-zone specific moment factory
    const momentTZ = function() {
      return moment.tz(...arguments, calendar.timeZone)
    }

    let today = momentTZ()
      .add(-320, 'days')

    console.info(today.toString())

    const upcomingEvents = getEventsAfterDate(events, today)
    const upcomingEventsArr = getUpcomingEvents(upcomingEvents, NO_OF_UPCOMING_DAYS)

    return (
      <div className="UpcomingEvents">
        {/* NCNCA container, 2x320px - 20px gutters = 620px, 2 columns */}
        <div style={{width: '100%'}} >
          {upcomingEventsArr.map((eventsForDay, i) =>
            <UpcomingEventsForDay
              key={i}
              today={today}
              date={eventsForDay[0].date}
              events={eventsForDay.sort(byLocation)}/>
          )}
        </div>
      </div>
    )
  }
}

UpcomingEvents.propTypes = {
  calendar: PropTypes.object,
  events: PropTypes.array,
}

import { connect } from 'react-redux'
import { getCalendar, getEventsForCalendar } from 'shared/reducers/reducer.js'


export default connect(
  (state, ownProps) => ({
    calendar: getCalendar(state, {calendarId: 'cal-ncnca-2016'}),
    events: getEventsForCalendar(state, {calendarId: 'cal-ncnca-2016'})
  })
)(UpcomingEvents)
