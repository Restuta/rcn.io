import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Day.scss'
import Col from 'atoms/Col.jsx'
import classnames from 'classnames'
import {zeroPad} from 'utils/formatting'
import {Months} from './utils/date-utils.js'
import Grid from 'styles/grid'
import Colors from 'styles/colors'
// import RoundBadge from 'calendar/badges/RoundBadge.jsx'

export default class Day extends Component {
  render() {
    const {
      size,
      day,
      month,
      //year,
      //color,
      itIsToday,
      itIsFirstDayOfMonth,
      itIsLastDayOfMonth,
      itIsCurrentMonthsDay,
      dayOfWeek,
      // weekNumber,
      containerWidth,
    } = this.props

    const itIsEmpty = (!this.props.children || this.props.children.length === 0)
    const itIsSpecialDayOfMonth = (itIsLastDayOfMonth || itIsFirstDayOfMonth)
    const itsSuperNarrowView = (containerWidth <= Grid.ContainerWidth.SM && size === 1)
    const itIsSunday = dayOfWeek === 7

    const classNames = classnames('Day', {
      ['Day-today']: itIsToday,
      ['today-narrow']: (itIsToday && itsSuperNarrowView),
      ['Day-current-month']: itIsCurrentMonthsDay,
      ['Day-empty']: itIsEmpty,
      ['Day-special']: itIsSpecialDayOfMonth,
      ['Day-first-of-month']: itIsFirstDayOfMonth,
      ['Day-last-of-month']: itIsLastDayOfMonth
    })

    const formattedDate = zeroPad(day, 1)
    const style = {}

    let specialDayOfMonthComponent = null

    //Sunday is not likely to get minimized ever and we showing every even week what is
    //currentm month.
    if (itIsSpecialDayOfMonth || itIsSunday) {
      const specialDayClassNames = classnames('day-of-month-label')

      let monthLblStyle = { color: 'black' }

      if (itIsSunday || itIsLastDayOfMonth) {
        if (itIsCurrentMonthsDay) {
          monthLblStyle.color = Colors.grey600
        } else {
          monthLblStyle.color = Colors.grey500
        }
      }

      specialDayOfMonthComponent = (
        <h4 key={1} className={specialDayClassNames}>
          <span style={monthLblStyle}>{Months[month - 1].short}&nbsp;</span>
        </h4>
      )
    }

    let dateComponent = (
      <span key={2} className="Day-date-wrapper">
        {formattedDate}
      </span>
    )

    let dayHeaderComponent = null

    if (itIsLastDayOfMonth && itsSuperNarrowView) {
      dayHeaderComponent = [dateComponent]
    } else if (itIsFirstDayOfMonth && itsSuperNarrowView) {
      dayHeaderComponent = [specialDayOfMonthComponent]
    } else {
      dayHeaderComponent = [
        specialDayOfMonthComponent,
        dateComponent
      ]
    }

    return (
      <Col xs={size} className={classNames} style={style}>
        <div className="Day-date fix-fout">
          {dayHeaderComponent}
        </div>
        {this.props.children}
      </Col>
    )
  }
}

Day.propTypes = {
  size: PropTypes.oneOf([1, 2, 3, 4]),
  day: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  color: PropTypes.string,
  itIsToday: PropTypes.bool,
  itIsFirstDayOfMonth: PropTypes.bool,
  itIsLastDayOfMonth: PropTypes.bool,
  itIsCurrentMonthsDay: PropTypes.bool,
  dayOfWeek: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7]),
  weekNumber: PropTypes.number.isRequired,
  containerWidth: PropTypes.number,
}
