import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Month.scss'
// import Row from '../atoms/Row.jsx'
// import Col from '../atoms/Col.jsx'
import moment from 'moment'

export default class Month extends Component {
  render() {

    let formattedDate = moment({
      month: this.props.number,
      year: this.props.year
    })
    .format('MMMM YYYY')

    return (
      <div className="Month">{formattedDate}</div>
    )
  }
}

Month.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired
}
