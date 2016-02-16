import React, {PropTypes} from 'react'
import Component from 'react-pure-render/component'
import './Calendar.scss'
import Month from './Month.jsx'

export default class Calendar extends Component {
  render() {
    return (
      <div className="Calendar">
        <div className="content">
          <h1>Calendar for 2016</h1>
          <Month number={1} year={2016} />
          <Month number={2} year={2016} />
        </div>
      </div>
    )
  }
}

Calendar.propTypes = {
  year: PropTypes.number
}
