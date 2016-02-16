import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Month.scss'
// import Row from '../atoms/Row.jsx'
// import Col from '../atoms/Col.jsx'

export default class Month extends Component {
  render() {
    const monthNames = ['January', 'February', 'March', 'April']
    const monthName = monthNames[this.props.number]

    return (
      <div className="Month">{monthName}, {this.props.year}</div>
    )
  }
}

Month.propTypes = {
  number: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired
}
