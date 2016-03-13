import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Day.scss'
import Col from 'atoms/Col.jsx'
import classnames from 'classnames'
import {zeroPad} from 'utils/formatting'
import {Months} from './utils/date-utils.js'

export default class Day extends Component {
  render() {
    const {
      size,
      day,
      month,
      //year,
      color,
      itIsToday,
      itIsFirstDayOfMonth,
      itIsLastDayOfMonth,
      itIsCurrentMonthsDay
    } = this.props

    const classNames = classnames('Day',
      (itIsToday && 'Day-today'),
      (itIsCurrentMonthsDay && 'Day-current-month')
    )

    const formattedDate = zeroPad(day, 1)
    const style = {
      //backgroundColor: color,
    }

    const lastDayOfMonthComponent = itIsLastDayOfMonth ? <span>{Months[month - 1].short} </span> : null
    const firstDayOfMonthComponent = itIsFirstDayOfMonth ? <span>{Months[month - 1].short} </span> : null

    return (
      <Col xs={size} className={classNames} style={style}>
        <div className="Day-date">
          {itIsToday && <h4 className="Day-today-label">TODAY</h4>}
          {lastDayOfMonthComponent}
          {firstDayOfMonthComponent}
          {formattedDate}
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
  itIsCurrentMonthsDay: PropTypes.bool
}
