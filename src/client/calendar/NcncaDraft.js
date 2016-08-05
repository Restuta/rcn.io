import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Calendar from './Calendar.jsx'
import Grid from 'styles/grid'
import { connect } from 'react-redux'
import { requestEventsFetch } from 'shared/actions/actions.js'
import Spinner from 'atoms/Spinner.jsx'


const sizesMaxWeekends = [1, 1, 1, 1, 2, 4, 4]
const sizesEqual = [2, 2, 2, 2, 2, 2, 2]

class NcncaDraftCalendar extends Component {
  componentWillMount() {
    if (!this.props.eventsAreLoaded) {
      this.props.requestEventsFetch('cal-ncnca-2017-draft')
    }
  }

  render() {
    const { containerWidth, calendarIsLoading } = this.props
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
          <h2 className="text-xs-center">Loading Calendar from Google Spreedsheet</h2>
          <Spinner />
        </div>
      </div>
    )

    return (
      <div>
        {calendarIsLoading
          ? LoadingComp
          : <Calendar
            calendarId="cal-ncnca-2017-draft"
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

export default connect(
  (state, ownProps) => {
    const calendar = state.calendars['cal-ncnca-2017-draft']
    const eventsIds = calendar.eventsIds

    return {
      calendarIsLoading: !calendar.loaded,
      eventsAreLoaded: (eventsIds && eventsIds.length > 0)
    }
  },
  (dispatch, ownProps) => ({
    requestEventsFetch: (calendarId) => dispatch(requestEventsFetch({calendarId}))
  })
)(NcncaDraftCalendar)
