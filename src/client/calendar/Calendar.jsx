import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Event from './events/Event.jsx'
import WeekdaysHeader from './WeekdaysHeader.jsx'
import {firstDayOfMonth, lastDayOfMonth} from './utils/date-utils.js'
import Colors from 'styles/colors'
import {Disciplines, Events} from 'temp/events'
import moment from  'moment-timezone'
import { connect } from 'react-redux'
import { toggleShowPastEvents } from 'shared/actions/actions.js'

const findEventByDate = (eventsMap, date) => {
  const key = date.format('MMDDYYYY')
  return eventsMap.get(key) || []
}

class Calendar extends Component {
  render() {
    console.info('Calendar render is called')
    const {
      name,
      year,
      containerWidth,
      weekdaysSizes,
      events,
      discipline,
      region,
      timeZone,
      showPastEvents,
      onShowFullHidePastClick
    } = this.props

    //console.info(showPastEvents)

    //time-zone specific moment factory
    const momentTZ = () => moment.tz(...arguments, timeZone)
    const today = momentTZ()

    //TODO: refactor all the ternary expressions on simple conditional

    const eventsTotalFromToday = events.getTotalFrom(today)
    const eventsTotal = events.total

    const startDate = showPastEvents
      ? moment({year: year, month: 0, day: 1}).startOf('isoWeek') //resetting date to first day of week
      : momentTZ().isoWeekday(-6) //this set's a date to two weeks back monday

    const totalWeeks = showPastEvents
      ? startDate.isoWeeksInYear()
      : startDate.isoWeeksInYear() - startDate.get('isoWeeks') + 1

    let currentDate = startDate.clone()
    let weeksComponents = []

    for (let i = 1; i <= totalWeeks; i++) {
      let daysComponents = []

      for (let k = 1; k <= 7; k++) {
        const daySize = weekdaysSizes[currentDate.isoWeekday() - 1]
        const month = currentDate.month() + 1
        const currentDayIsToday = (today.isSame(currentDate, 'days'))
        const currentDayBelongsToTodaysMonth = (today.isSame(currentDate, 'month'))

        const foundEvents = findEventByDate(events.eventsMap, currentDate)
        //const foundEvents = [{name: 'Test Event Name Criterium'}]

        let eventComponents

        if (foundEvents.length > 0) {
          eventComponents = foundEvents.map((event, i) =>
            <Event id={event.id} key={i} width={daySize} containerWidth={containerWidth}
              name={event.name} discipline={discipline} event={event}/>
          )
        }

        daysComponents.push(
          <Day key={k} year={currentDate.year()} month={month} day={currentDate.date()}
            size={daySize}
            itIsToday={currentDayIsToday}
            itIsFirstDayOfMonth={firstDayOfMonth(currentDate)}
            itIsLastDayOfMonth={lastDayOfMonth(currentDate)}
            itIsCurrentMonthsDay={currentDayBelongsToTodaysMonth}
            containerWidth={containerWidth}
            dayOfWeek={currentDate.isoWeekday()}
            weekNumber={currentDate.isoWeek()}>
            {eventComponents}
          </Day>
        )
        currentDate.add(1, 'day')
      }

      weeksComponents.push(<Week key={i} lastOne={i === totalWeeks}>{daysComponents}</Week>)
    }

    let subTitleComp

    if (!showPastEvents) {
      subTitleComp = (
        <h3 className="sub-title">
          {eventsTotalFromToday} upcoming events from Today ({today.format('MMMM Do')})
          <a className="show-more-or-less" onClick={onShowFullHidePastClick}>show all {eventsTotal} events</a>
        </h3>
      )
    } else {
      subTitleComp = (
        <h3 className="sub-title">
          {eventsTotal} events
          <a className="show-more-or-less" onClick={onShowFullHidePastClick}>
            hide past {eventsTotal - eventsTotalFromToday} events
          </a>
        </h3>
      )
    }

    return (
      <div className="Calendar">
        {/*{eventDetailsModal.isOpen && <EventDetailsModal onClose={this.onEventDetailsModalClose}/>}*/}
        <h1 className="title">
          {region + ' '}
          {discipline && <span style={{color: Colors.brownMud}}>{discipline + ' '}</span>}
          {name} <span>{year}</span>
        </h1>
        {subTitleComp}

        <WeekdaysHeader sizes={weekdaysSizes} containerWidth={containerWidth}/>
        <div className="body">
          {weeksComponents}
        </div>
      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  calendarId: PropTypes.string.isRequired,
  weekdaysSizes: PropTypes.arrayOf(React.PropTypes.number),
  timeZone: PropTypes.string.isRequired, //list of timezones https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json
  events: PropTypes.instanceOf(Events),
  region: PropTypes.string,
  discipline: PropTypes.oneOf([Disciplines.MTB, Disciplines.Road]),
  containerWidth: PropTypes.number.isRequired,
  showPastEvents: PropTypes.bool,
  onShowFullHidePastClick: PropTypes.func,

  // showEventDetailsModal: PropTypes.func,
  // closeEventDetailsModal: PropTypes.func,
  // eventDetailsModal: PropTypes.shape({
  //   isOpen: PropTypes.bool,
  //   eventId: PropTypes.string
  // }),
  //current location object passed from react-router
  // location: PropTypes.object.isRequired,
}

export default connect(
  (state, ownProps) => state.calendars[ownProps.calendarId],
  (dispatch, ownProps) => ({
    onShowFullHidePastClick: () => dispatch(toggleShowPastEvents(ownProps.calendarId))
  })
)(Calendar)
