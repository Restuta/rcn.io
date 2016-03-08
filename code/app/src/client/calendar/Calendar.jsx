import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Day from './Day.jsx'
import Week from './Week.jsx'
import Event from './Event.jsx'
import WeekdaysHeader from './WeekdaysHeader.jsx'
import moment from 'moment'

export default class Calendar extends Component {
  render() {
    const {name, year, containerWidth} = this.props

    //const months = moment.months()
    //resetting date to first day of week
    let startDate = moment({year: year, month: 0, day: 1}).startOf('isoWeek')
    const totalWeeks = startDate.isoWeeksInYear()

    let weeks = []
    let currentDate = startDate.clone()
    let dayOfWeekToSizeMap = {
      1: 2,
      2: 2,
      3: 2,
      4: 2,
      5: 2,
      6: 2,
      7: 2,
    }

    const today = moment()

    //TODO: try to paint each month in alternating color to see how easy is to work with months
    for (let i = 1; i <= totalWeeks; i++) {
      let days = []

      for (let k = 1; k <= 7; k++) {
        const firstDayOfMonthMarker = currentDate.date() === 1 ? currentDate.format('MMMM').toUpperCase() : null
        const daySize = dayOfWeekToSizeMap[currentDate.isoWeekday()]

        const fade = percentage => {
          return `rgba(255, 82, 125, ${percentage})`
        }

        const monthColorMap = {
          1: fade(0.05),
          2: fade(0.1),
          3: fade(0.15),
          4: fade(0.2),
          5: fade(0.25),
          6: fade(0.30),
          7: fade(0.25),
          8: fade(0.20),
          9: fade(0.15),
          10: fade(0.10),
          11: fade(0.05),
          12: fade(0),
        }

        const month = currentDate.month() + 1
        const color = monthColorMap[month]

        const currentDayIsToday = (today.isSame(currentDate, 'days'))

        days.push(
          <Day key={k} year={currentDate.year()} month={month} day={currentDate.date()}
            size={daySize} color={color} isToday={currentDayIsToday}>
            {firstDayOfMonthMarker && <h3 style={{margin: '1rem 0 1rem 0'}}>{firstDayOfMonthMarker}</h3>}
            {(() => {
              if (Math.random() < 0.3) {
                return <Event width={2} containerWidth={containerWidth} name="Dunnigan Hills Road Race"/>
              }
            })()}

          </Day>
        )
        currentDate.add(1, 'day')
      }


      weeks.push(<Week key={i} lastOne={i === totalWeeks}>{days}</Week>)
    }

    return (
      <div className="Calendar">
        <h1>{name} {year}</h1>
        <h3 style={{
          color: 'grey'
        }}>Auto-generated</h3>
        <WeekdaysHeader sizes={[2, 2, 2, 2, 2, 2, 2]}/>
        <div className="Calendar-body">
          {weeks}
        </div>

        <h1>{name}</h1>
        <WeekdaysHeader sizes={[2, 2, 2, 2, 2, 2, 2]}/>
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
  name: PropTypes.string
}
