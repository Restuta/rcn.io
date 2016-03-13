import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Event from './Event.jsx'
import WeekdaysHeader from './WeekdaysHeader.jsx'
import moment from 'moment'
import {firstDayOfMonth, lastDayOfMonth} from './utils/date-utils.js'


export default class Calendar extends Component {
  render() {
    const {name, year, containerWidth, weekdaysSizes} = this.props

    //resetting date to first day of week
    const startDate = moment({year: year, month: 0, day: 1}).startOf('isoWeek')
    const totalWeeks = startDate.isoWeeksInYear()

    let weekdsComponents = []
    let currentDate = startDate.clone()
    const today = moment()

    for (let i = 1; i <= totalWeeks; i++) {
      let daysComponents = []

      for (let k = 1; k <= 7; k++) {
        const daySize = weekdaysSizes[currentDate.isoWeekday() - 1]
        const month = currentDate.month() + 1
        const currentDayIsToday = (today.isSame(currentDate, 'days'))
        const currentDayBelongsToTodaysMonth = (today.isSame(currentDate, 'month'))

        daysComponents.push(
          <Day key={k} year={currentDate.year()} month={month} day={currentDate.date()}
            size={daySize}
            itIsToday={currentDayIsToday}
            itIsFirstDayOfMonth={firstDayOfMonth(currentDate)}
            itIsLastDayOfMonth={lastDayOfMonth(currentDate)}
            itIsCurrentMonthsDay={currentDayBelongsToTodaysMonth} >
            {(() => {
              if (Math.random() < 0.3) {
                return <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              }
            })()}
            {(() => {
              if (Math.random() < 0.3) {
                return <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              }
            })()}
            {(() => {
              if (Math.random() < 0.3) {
                return <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              }
            })()}
          </Day>
        )
        currentDate.add(1, 'day')
      }

      weekdsComponents.push(<Week key={i} lastOne={i === totalWeeks}>{daysComponents}</Week>)
    }

    return (
      <div className="Calendar">
        <h1>{name} {year}</h1>
        <h3 style={{
          color: 'grey'
        }}>Auto-generated</h3>
        <WeekdaysHeader sizes={weekdaysSizes}/>
        <div className="Calendar-body">
          {weekdsComponents}
        </div>

        <h1>{name}</h1>
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

          <Week>
            <Day year={2016} month={1} day={8} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={9} size={2}/>
            <Day year={2016} month={1} day={10} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={11} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={12} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={13} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={14} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
          </Week>

          <Week>
            <Day year={2016} month={1} day={15} size={2}/>
            <Day year={2016} month={1} day={16} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={17} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={18} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={19} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={20} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={31} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
          </Week>

          <Week>
            <Day year={2016} month={1} day={15} size={2}/>
            <Day year={2016} month={1} day={16} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={17} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={18} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={19} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={20} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
            <Day year={2016} month={1} day={31} size={2}>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
            </Day>
          </Week>
        </div>

      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number,
  name: PropTypes.string,
  weekdaysSizes: PropTypes.arrayOf(React.PropTypes.number)
}
