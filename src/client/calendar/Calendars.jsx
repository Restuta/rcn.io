import Component from 'react-pure-render/component'
import './Calendars.scss'
import React from 'react'

class Calendars extends Component {
  render() {
    const {
      calendars
    } = this.props

    const calendarsComponents = Object.keys(calendars)
      .map(key => <li key={key}>
        <a href={`calendars/${key.replace('cal-', '')}`}>
          {calendars[key].name}
        </a>
        {calendars[key].description && <p>Description: <b>{calendars[key].description}</b></p>}
      </li>)

    return (
      <div style={{display: 'flex'}}>
        <div>Calendars:</div>
        <ul className='Calendars'>
          {calendarsComponents}
        </ul>
      </div>
    )
  }
}

import { connect } from 'react-redux'
import { getAllCalendars } from 'shared/reducers/reducer.js'

export default connect(
  (state, ownProps) => ({
    calendars: getAllCalendars(state)
  })
)(Calendars)
