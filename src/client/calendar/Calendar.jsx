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
      location
    } = this.props


    //resetting date to first day of week
    const startDate = moment({year: year, month: 0, day: 1}).startOf('isoWeek')
    const totalWeeks = startDate.isoWeeksInYear()
    let currentDate = startDate.clone()

    let weekdsComponents = []
    const today = moment()

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
            containerWidth={containerWidth}>
            {eventComponents}
          </Day>
        )
        currentDate.add(1, 'day')
      }

      weekdsComponents.push(<Week key={i} lastOne={i === totalWeeks}>{daysComponents}</Week>)
    }

    return (
      <div className="Calendar">
        <h1 className="Calendar-title">
          {location + ' '}
          {discipline && <span style={{color: Colors.brownMud}}>{discipline + ' '}</span>}
          {name} <span>{year}</span>
        </h1>
        <h3 className="Calendar-sub-title">{events.total} events</h3>

        <WeekdaysHeader sizes={weekdaysSizes} containerWidth={containerWidth}/>
        <div className="Calendar-body">
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
  containerWidth: PropTypes.number
}
