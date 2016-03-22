import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Event from './Event.jsx'
import WeekdaysHeader from './WeekdaysHeader.jsx'
import moment from 'moment'
import {firstDayOfMonth, lastDayOfMonth} from './utils/date-utils.js'



//TODO: what it returns if several events match the criteria?
//TODO: optimize the flow so we don't call this function every time, build a hash-map
const findEventByDate = (events, date) => {
  const key = date.format('MMDDYYYY')
  return events[key] || []
}


  //events.filter(event => event.date.isSame(date, 'day'))


export default class Calendar extends Component {
  render() {
    const {name, year, containerWidth, weekdaysSizes, events} = this.props

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

        const foundEvents = findEventByDate(events, currentDate)
        //const foundEvents = [{name: 'Test Event Name Criterium'}]
        let eventComponents

        if (foundEvents.length > 0) {
          eventComponents = foundEvents.map((event, i) =>
            <Event key={i} width={daySize} containerWidth={containerWidth} name={event.name}/>
          )
        }

        daysComponents.push(
          <Day key={k} year={currentDate.year()} month={month} day={currentDate.date()}
            size={daySize}
            itIsToday={currentDayIsToday}
            itIsFirstDayOfMonth={firstDayOfMonth(currentDate)}
            itIsLastDayOfMonth={lastDayOfMonth(currentDate)}
            itIsCurrentMonthsDay={currentDayBelongsToTodaysMonth} >
            {eventComponents}
            {/*{(() => {
              if (Math.random() < 0.3) {
                return <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              }
            })()}*/}
          </Day>
        )
        currentDate.add(1, 'day')
      }

      weekdsComponents.push(<Week key={i} lastOne={i === totalWeeks}>{daysComponents}</Week>)
    }

    return (
      <div className="Calendar">
        <h1 style={{
          marginBottom: '4rem'
        }}>{name} {year}</h1>

        <WeekdaysHeader sizes={weekdaysSizes}/>
        <div className="Calendar-body">
          {weekdsComponents}
        </div>

        {/*<h1>{name}</h1>
        <WeekdaysHeader sizes={weekdaysSizes}/>
        <div className="Calendar-body">
          <Week>
            <Day year={2016} month={1} day={1} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={2} size={2}/>
            <Day year={2016} month={1} day={3} size={2}/>
            <Day year={2016} month={1} day={4} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={5} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={6} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={7} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
          </Week>
        </div>*/}

      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number,
  name: PropTypes.string,
  weekdaysSizes: PropTypes.arrayOf(React.PropTypes.number),
  events: PropTypes.array
}
