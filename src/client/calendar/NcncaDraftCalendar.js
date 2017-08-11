import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import Grid from 'styles/grid'
import Spinner from 'atoms/Spinner.jsx'
import getCalendarId from './utils/get-calendar-id'

const sizesMaxWeekends = [1, 1, 1, 1, 2, 4, 4]
const sizesEqual = [2, 2, 2, 2, 2, 2, 2]

const getDraftCalendarId = (id) => (getCalendarId(id) + '-draft')

class NcncaDraftCalendar extends Component {
  componentWillMount() {
    if (!this.props.eventsAreLoaded) {
      this.props.requestEventsFetch()
    }
  }

  render() {
    const { containerWidth, calendarIsLoading } = this.props
    const calendarId = getDraftCalendarId(this.props.params.calendarId)
    let weekdaysSizes

    if (containerWidth <= Grid.ContainerWidth.SM) {
      weekdaysSizes = sizesMaxWeekends
    } else if (containerWidth <= Grid.ContainerWidth.MD) {
      weekdaysSizes = sizesEqual
    }  else {
      weekdaysSizes = sizesEqual
    }

    const LoadingComp = (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20rem',
        flexWrap: 'no-wrap',
      }}>
        <div>
          <h2 className="text-xs-center">Loading Calendar from Google Spreedsheet...</h2>
          <Spinner/>
        </div>
      </div>
    )

    return (
      <div>
        {calendarIsLoading
          ? LoadingComp
          : <Calendar
            calendarId={calendarId}
            containerWidth={containerWidth}
            weekdaysSizes={weekdaysSizes}
            />
        }

      </div>
    )
  }
}

NcncaDraftCalendar.propTypes = {
  eventsAreLoaded: PropTypes.bool.isRequired,
  requestEventsFetch: PropTypes.func.isRequired,
  calendarIsLoading: PropTypes.bool.isRequired,
}

import { connect } from 'react-redux'
import { requestEventsFetch } from 'shared/actions/actions.js'

export default connect(
  (state, ownProps) => {
    const calendarId = getDraftCalendarId(ownProps.params.calendarId)
    const calendar = state.calendars[calendarId]
    const eventsIds = calendar.eventsIds

    return {
      calendarIsLoading: !calendar.loaded,
      eventsAreLoaded: (eventsIds && eventsIds.length > 0)
    }
  },
  (dispatch, ownProps) => {
    const calendarId = getDraftCalendarId(ownProps.params.calendarId)
    return {
      requestEventsFetch: () => dispatch(requestEventsFetch({ calendarId }))
    }
  }
)(NcncaDraftCalendar)
