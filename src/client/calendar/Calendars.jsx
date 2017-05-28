import Component from 'react-pure-render/component'
import React from 'react'

class Calendars extends Component {
  render() {
    const {
      calendars
    } = this.props

    const calendarsComponent = Object.keys(calendars)
      .map(k => <li key={k}>
        <a href={`calendars/${k.replace('cal-', '')}`}>{calendars[k].name}</a>
      </li>)

    return (
      <div>
        <span>Calendars:</span>
        <ul>
          {calendarsComponent}
        </ul>
      </div>
    )
  }
}

import { connect } from 'react-redux'
import { getAllCalendars } from 'shared/reducers/reducer.js'

export default connect(
  (state, ownProps) => ({
    calendars: getAllCalendars(state, ownProps)
  })
)(Calendars)
