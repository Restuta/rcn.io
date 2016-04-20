import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Day.scss'
import Col from 'atoms/Col.jsx'
import classnames from 'classnames'
import {zeroPad} from 'utils/formatting'
import {Months} from './utils/date-utils.js'
import Grid from 'styles/grid'
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
      containerWidth
    } = this.props

    const itIsEmpty = (!this.props.children || this.props.children.length === 0)
    const itIsSpecialDayOfMonth = (itIsLastDayOfMonth || itIsFirstDayOfMonth)
    const itsSuperNarrowView = (containerWidth <= Grid.ContainerWidth.XS && size === 1)

    const classNames = classnames('Day',
      (itIsToday && 'Day-today'),
      (itIsCurrentMonthsDay && 'Day-current-month'),
      (itIsEmpty && 'Day-empty'),
      (itIsSpecialDayOfMonth && 'Day-special')
    )

    const formattedDate = zeroPad(day, 1)
    const style = {
      //backgroundColor: color,
    }

    let specialDayOfMonthComponent = null

    if (itIsSpecialDayOfMonth) {
      const specialDayClassNames = classnames('day-of-month-label',
        (itIsLastDayOfMonth && 'last'),
        (itIsFirstDayOfMonth && 'first')
      )

      specialDayOfMonthComponent = (
        <h4 key={1} className={specialDayClassNames}>
          <span>{Months[month - 1].short}&nbsp;</span>
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
        <div className="Day-date">
          {/*{specialDayOfMonthComponent}
          {dateComponent}*/}
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

  containerWidth: PropTypes.number
}
