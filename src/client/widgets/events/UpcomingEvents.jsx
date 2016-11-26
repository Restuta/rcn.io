import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Event from 'calendar/events/Event.jsx'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import moment from  'moment-timezone'
// import Grid from 'styles/grid'
import './UpcomingEvents.scss'
import { Disciplines } from 'calendar/events/types'
import Colors from 'styles/colors'

const getEventAferDate = (events, momentDate) => events.filter(x => x.date.isSameOrAfter(momentDate))
  .sort((a, b) => a.date - b.date)

//layout logic
//calculate container size based on breakpoints, if >=544 i'ts two column container, so devide by 2
  //if less it's single column

class UpcomingEvents extends Component {

  constructor(props) {
    super(props)
    this.daysBack = 330
  }

  // componentDidMount() {
  //   setInterval(() => this.setState({
  //     daysBack: --this.daysBack
  //   }), 3000)
  // }

  render() {

    const { calendar, events } = this.props

    //time-zone specific moment factory
    const momentTZ = function() {
      return moment.tz(...arguments, calendar.timeZone)
    }

    let today = momentTZ()
      // .add(-this.daysBack, 'days')
      .add(-314, 'days')
    console.info('Today is ' + today.format('dddd, MMMM DD YYYY'))
    console.info('Days back: ' + this.daysBack)

    const upcomingEvents = getEventAferDate(events, today)


    let upcomingEventsByDay = {}
    const NO_OF_UPCOMING_DAYS = 3

    for (let i = 0; i < upcomingEvents.length; i++) {
      const currEvent = upcomingEvents[i]

      if (!upcomingEventsByDay[currEvent.datePlain] && Object.keys(upcomingEventsByDay).length === NO_OF_UPCOMING_DAYS) {
        break
      }

      if (!upcomingEventsByDay[currEvent.datePlain]) {
        upcomingEventsByDay[currEvent.datePlain] = [currEvent]
      } else {
        upcomingEventsByDay[currEvent.datePlain].push(currEvent)
      }
    }

    console.info(upcomingEventsByDay)


    // const cardWith = getCardWidth(cardContainerWidth)

    const createEventComps = events => {
      const cardWith = 'initial'
      const createEventComp = (event, cardWith) => (
        <Event key={event.id} className="upcoming-event" id={event.id}
          autoHeight
          externallyControlledWidth
          showEventTypeBadge
          width={cardWith} event={event}/>
      )

      return events.map(event => createEventComp(event, cardWith))
    }

    return (
      <div className="UpcomingEvents">
        {/* NCNCA container, 2x320px - 20px gutters = 620px, 2 columns */}
        <div style={{width: '100%'}}>
          <Row>
            {/* change column size dynamically depending on numbe of events on that day */}
            <Col xs={14} sm={14}>
              <h3 className="header-regular w-900">
                {upcomingEventsByDay[Object.keys(upcomingEventsByDay)[0]][0].date.format('dddd, MMMM Do')}
                {/* <i style={{fontSize: '1.625rem', color: Colors.grey500, whiteSpace: 'nowrap'}}>
                  &nbsp;({upcomingEventsByDay[Object.keys(upcomingEventsByDay)[0]][0].date.from(today)})
                </i> */}
              </h3>
              <div className="events-container">
                {createEventComps(upcomingEventsByDay[Object.keys(upcomingEventsByDay)[0]])}
              </div>
            </Col>
            <Col xs={14} sm={14}>
              <h3 className="header-regular w-900">
                {upcomingEventsByDay[Object.keys(upcomingEventsByDay)[1]][0].date.format('dddd, MMMM Do')}
                {/* <i style={{fontSize: '1.625rem', color: Colors.grey500}}>
                  &nbsp; ({upcomingEventsByDay[Object.keys(upcomingEventsByDay)[1]][0].date.from(today)})
                </i> */}
              </h3>
              <div className="events-container">
                {createEventComps(upcomingEventsByDay[Object.keys(upcomingEventsByDay)[1]])}
              </div>
            </Col>
            <Col xs={14} sm={14}>
              <h3 className="header-regular w-900">
                {upcomingEventsByDay[Object.keys(upcomingEventsByDay)[2]][0].date.format('dddd, MMMM Do')}
                {/* <i style={{fontSize: '1.625rem', color: Colors.grey500}}>
                  &nbsp; ({upcomingEventsByDay[Object.keys(upcomingEventsByDay)[2]][0].date.from(today)})
                </i> */}
              </h3>
              <div className="events-container">
                {createEventComps(upcomingEventsByDay[Object.keys(upcomingEventsByDay)[2]])}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

UpcomingEvents.propTypes = {
  calendar: PropTypes.object,
  events: PropTypes.array,
}

import { connect } from 'react-redux'
import { getCalendar, getEventsForCalendar } from 'shared/reducers/reducer.js'


export default connect(
  (state, ownProps) => ({
    calendar: getCalendar(state, {calendarId: 'cal-ncnca-2016'}),
    events: getEventsForCalendar(state, {calendarId: 'cal-ncnca-2016'})
  })
)(UpcomingEvents)
