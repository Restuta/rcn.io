import Component from 'react-pure-render/component'
import './Calendars.scss'
import React from 'react'

class Calendars extends Component {
  render() {
    const {
      calendars
    } = this.props

    const calendarsComponent = Object.keys(calendars)
      .map(k => <li key={k}>
        <a href={`calendars/${k.replace('cal-', '')}`}>
          {calendars[k].name}
        </a>
        {calendars[k].description && <p>Description: <b>{calendars[k].description}</b></p>}
      </li>)

    return (
      <ul className='Calendars'>
        <li>Calendars:</li>
        {calendarsComponent}
      </ul>
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
