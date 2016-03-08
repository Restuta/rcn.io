import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Day.scss'
import Col from 'atoms/Col.jsx'
import classnames from 'classnames'
import {zeroPad} from 'utils/formatting'

export default class Day extends Component {
  render() {
    const {
      size,
      day,
      //month,
      //year,
      color,
      isToday
    } = this.props
    const classNames = classnames('Day', (isToday && 'Day-today'))

    const formattedDate = zeroPad(day, 1)

    const style = {
      backgroundColor: color,
    }

    return (
      <Col xs={size} className={classNames} style={style}>
        <div className="Day-date">
          {formattedDate}
          {isToday && <h4 className="Day-today-label">TODAY</h4>}
        </div>
        {this.props.children}
      </Col>
    )
  }
}

Day.propTypes = {
  size: React.PropTypes.oneOf([1, 2, 3, 4]),
  day: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  color: PropTypes.string,
  isToday: PropTypes.bool,
}
