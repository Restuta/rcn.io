import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Day.scss'
import Col from 'atoms/Col.jsx'
import Row from 'atoms/Row.jsx'
import moment from 'moment'

export class Week extends Component {
  render() {
    const style = {
      backgroundColor: '#F5F5F5'
    }

    return (
      <Row className="Week" style={style}>
        {this.props.children}
      </Row>
    )
  }
}

Week.propTypes = {
  children: function(props, propName, componentName) {

    const children = props[propName]

    // if (children.reduce((x, y) => x.props.size + y.props.size ) !== 14) {   return new Error('A Week must have exactly 14 sizes, duh!') }
    // Only accept a single child, of the appropriate type
    if (React.Children.count(children) !== 7) {
      return new Error('`' + componentName + '` should have 7 children of the type "Day", but only '
        + React.Children.count(children) + ' were provided')
    }

    const totalDaysSizes = children.reduce((x, y, index) => {
      if (index === 1) {
        return x.props.size + y.props.size
      } else {
        return x + y.props.size
      }
    })

    if (totalDaysSizes !== 14) {
      return new Error(`Total size of all Days should be exactly 14 to fit 14 columns of the grid.`
        + `Provided sum was: ${totalDaysSizes}`)
    }

    return null
  }
}

export class Day extends Component {
  render() {
    const {size, day, month, year} = this.props

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

export default Day
