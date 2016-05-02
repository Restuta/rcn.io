import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Event from './events/Event.jsx'
import WeekdaysHeader from './WeekdaysHeader.jsx'
import moment from 'moment'
import {firstDayOfMonth, lastDayOfMonth} from './utils/date-utils.js'
import Colors from 'styles/colors'
import {Disciplines, Events} from 'temp/events'

const findEventByDate = (eventsMap, date) => {
  const key = date.format('MMDDYYYY')
  return eventsMap.get(key) || []
}


export default class Calendar extends Component {
  render() {
    const {
      name,
      year,
      containerWidth,
      weekdaysSizes,
      events,
      discipline,
      location,
      showOnlyFuture = false
    } = this.props

    const today = moment()

    //TODO: refactor all the ternar expressions on simple conditional

    const eventsTotalFromToday = events.getTotalFrom(today)
    const eventsTotal = events.total

    const startDate = showOnlyFuture
      ? moment().isoWeekday(-6) //this set's a date to two weeks back monday
      : moment({year: year, month: 0, day: 1}).startOf('isoWeek') //resetting date to first day of week

    const totalWeeks = showOnlyFuture
      ? startDate.isoWeeksInYear() - startDate.get('isoWeeks') + 1
      : startDate.isoWeeksInYear()

    let currentDate = startDate.clone()

    let weekdsComponents = []


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
            <Event key={i} width={daySize} containerWidth={containerWidth}
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

      weekdsComponents.push(<Week key={i} lastOne={i === totalWeeks}>{daysComponents}</Week>)
    }


    let subTitleComp

    if (showOnlyFuture) {
      subTitleComp = (
        <h3 className="sub-title">
          {eventsTotalFromToday} events from {startDate.format('MMMM Do')} ({eventsTotal} total)
          <a className="show-more-or-less">show full year</a>
        </h3>
      )
    } else {
      subTitleComp = (
        <h3 className="sub-title">
          {eventsTotal} events
          <a className="show-more-or-less">hide past</a>
        </h3>
      )
    }

    return (
      <div className="Calendar">
        <h1 className="title">
          {location + ' '}
          {discipline && <span style={{color: Colors.brownMud}}>{discipline + ' '}</span>}
          {name} <span>{year}</span>
        </h1>
        {subTitleComp}

        <WeekdaysHeader sizes={weekdaysSizes} containerWidth={containerWidth}/>
        <div className="body">
          {weekdsComponents}
        </div>
      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number,
  name: PropTypes.string,
  weekdaysSizes: PropTypes.arrayOf(React.PropTypes.number),
  events: PropTypes.instanceOf(Events),
  location: PropTypes.string,
  discipline: PropTypes.oneOf([Disciplines.MTB, Disciplines.Road]),
  containerWidth: PropTypes.number,
  showOnlyFuture: PropTypes.bool
}
