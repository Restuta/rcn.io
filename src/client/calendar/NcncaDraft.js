import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import Grid from 'styles/grid'
import { connect } from 'react-redux'
import { requestEventsFetch } from 'shared/actions/actions.js'


const sizesMaxWeekends = [1, 1, 1, 1, 2, 4, 4]
const sizesEqual = [2, 2, 2, 2, 2, 2, 2]

class NcncaDraftCalendar extends Component {
  componentWillMount() {
    if (!this.props.eventsAreLoaded) {
      this.props.requestEventsFetch('cal-ncnca-2017-draft')
    }
  }

  render() {
    const { containerWidth } = this.props
    let weekdaysSizes

    if (containerWidth <= Grid.ContainerWidth.SM) {
      weekdaysSizes = sizesMaxWeekends
    } else if (containerWidth <= Grid.ContainerWidth.MD) {
      weekdaysSizes = sizesEqual
    }  else {
      weekdaysSizes = sizesEqual
    }

    return (
      <div>
        <Calendar
          calendarId="cal-ncnca-2017-draft"
          containerWidth={containerWidth}
          weekdaysSizes={weekdaysSizes}
          />
      </div>
    )
  }
}

NcncaDraftCalendar.propTypes = {
  eventsAreLoaded: PropTypes.bool.isRequired,
  requestEventsFetch: PropTypes.func.isRequired
}

export default connect(
  (state, ownProps) => {
    const eventsIds = state.calendars['cal-ncnca-2017-draft'].eventsIds
    let eventsAreLoaded = (eventsIds && eventsIds.length > 0)
    return {
      eventsAreLoaded
    }
  },
  (dispatch, ownProps) => ({
    requestEventsFetch: (calendarId) => dispatch(requestEventsFetch({calendarId}))
  })
)(NcncaDraftCalendar)
