import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Event from 'calendar/events/Event.jsx'
import moment from  'moment-timezone'
import './UpcomingEvents.scss'

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
  // most of the races start not earlier then 8am and if time is not set it defautls to midnight, this would result
  // in confusing relative time calculation, e.g. at 10pm a person would see "in 2 hours"
  const dateIsSetToMidnight = date.hours() === 0
  const adjustedDate = dateIsSetToMidnight
    ? date.add(8, 'hours')
    : date

  const relativeDateStr = adjustedDate.diff(today, 'days') === 1
    ? 'Tomorrow'
    : adjustedDate.from(today)

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

class UpcomingEvents extends Component {
  constructor(props) {
    super(props)
    this.onFullCalendarLinkClick = this.onFullCalendarLinkClick.bind(this)
  }

  onFullCalendarLinkClick(e) {
    e.preventDefault()
    //top-level window navigation
    window.top.location.href = `../calendars/${this.props.calendar.id}`
  }

  render() {

    const { calendar, events } = this.props
    const NO_OF_UPCOMING_DAYS = 4

    //time-zone specific moment factory
    const momentTZ = function() {
      return moment.tz(...arguments, calendar.timeZone)
    }

    let today = momentTZ()
      // .add(30, 'days')

    const upcomingEvents = getEventsAfterDate(events, today)
    const upcomingEventsArr = getUpcomingEvents(upcomingEvents, NO_OF_UPCOMING_DAYS)

    return (
      <div className="UpcomingEvents">
        {/* NCNCA container, 2x320px - 20px gutters = 620px, 2 columns */}
        <div style={{width: '100%'}} >
          {upcomingEventsArr.length > 0
            ? upcomingEventsArr.map(
              (eventsForDay, i) =>
                <UpcomingEventsForDay
                  key={i}
                  today={today}
                  date={eventsForDay[0].date}
                  events={eventsForDay.sort(byLocation)}/>
                )
            : (
            <div>
              <h3 className="header-regular w-500 text-center">No upcoming events in {calendar.year}</h3>
              <div className="text-3 text-center">
                See <a
                  onClick={this.onFullCalendarLinkClick}
                  href={`../calendars/${this.props.calendar.id}`}
                  >Full {calendar.year} Calendar</a> instead
              </div>
            </div>
            )
          }
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
    calendar: getCalendar(state, {calendarId: 'cal-ncnca-2017'}),
    events: getEventsForCalendar(state, {calendarId: 'cal-ncnca-2017'})
  })
)(UpcomingEvents)
