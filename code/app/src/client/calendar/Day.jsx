import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Day.scss'
import Col from 'atoms/Col.jsx'
import moment from 'moment'

export default class Day extends Component {
  render() {
    const {size, day, month, year} = this.props

    //console.info(`${day}/${month}/${year}`)

    let formattedDate = moment({
      day: day,
      month: month - 1, //momentjs counts monthes from 0
      year: year
    })
    .format('DD')

    return (
      <Col xs={size} className="Day">
        <div className="Day-date">{formattedDate}</div>
        {this.props.children}
      </Col>
    )
  }
}

Day.propTypes = {
  size: React.PropTypes.oneOf([1, 2, 3, 4]),
  day: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired
}
