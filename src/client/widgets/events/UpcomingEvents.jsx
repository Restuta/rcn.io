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

const RightSlash = (props) => (
  <span style={{color: 'silver', paddingLeft: '0.5rem', paddingRight: '0.5rem'}}>/</span>
)

class UpcomingEvents extends Component {
  render() {

    const { calendar, events } = this.props

    //time-zone specific moment factory
    const momentTZ = function() {
      return moment.tz(...arguments, calendar.timeZone)
    }

    let today = momentTZ()
      //.add(-150, 'weeks')

    const upcomingEvents = getEventAferDate(events, today)

    const upcomingMtbAndCxTrack = upcomingEvents.filter(x =>
      x.discipline === Disciplines.mtb
      || x.discipline === Disciplines.cyclocross)
      .slice(0, 6)

    const upcomingRoad = upcomingEvents
      .filter(x => x.discipline === Disciplines.road)
      .slice(0, 6)

    const upcomingOther = upcomingEvents
      .filter(x => x.discipline !== Disciplines.road
        && x.discipline !== Disciplines.mtb
        && x.discipline !== Disciplines.cyclocross
        && x.discipline !== Disciplines.track)
      .slice(0, 6)

    // const cardWith = getCardWidth(cardContainerWidth)

    const createEventComps = events => {
      const cardWith = 'initial'
      const createEventComp = (event, cardWith) => (
        // <Event key={event.id} id={event.id} externallyControlledWidth autoHeight width={cardWith} event={event}/>
        <div className="event-container">
          <div className="secondary" style={{
            color: Colors.grey600,
            marginTop: '0.5rem',
            marginBottom: '0.5rem'
          }}>{event.date.format('ddd, MMM DD')}</div>
          <Event className="widget-event" key={event.id} id={event.id} externallyControlledWidth autoHeight width={cardWith} event={event}/>
        </div>
      )

      return events.map(event => createEventComp(event, cardWith))
    }

    const createNoUpcomingEventsComp = (disciplineName) => (
      <div>No Upcoming {disciplineName} Events in {momentTZ().year()}.</div>
    )

    return (
      <div className="UpcomingEvents">
        {/* NCNCA container, 2x320px - 20px gutters = 620px, 2 columns */}
        <div style={{width: '100%'}}>
          <Row>
            <Col xs={14} sm={7}>
              <h3 className="header-regular w-900">
                <span>ROAD</span>
              </h3>
              <div className="events-container">
                {upcomingRoad.length
                  ? createEventComps(upcomingRoad)
                  : createNoUpcomingEventsComp('Road')}
              </div>
            </Col>
            <Col xs={14} sm={7}>
              <h3 className="header-regular w-900">
                <span style={{color: Colors.event.mtb.default}}>MTB</span>
                <RightSlash />
                <span style={{color: Colors.event.cyclocross.default}}>CX</span>
                <RightSlash />
                <span style={{color: Colors.event.track.default}}>TRACK</span>
                {/* <RightSlash />
                <span style={{color: '#424242'}}>OTHER</span> */}
              </h3>
              <div className="events-container">
                {upcomingMtbAndCxTrack.length
                  ? createEventComps(upcomingMtbAndCxTrack)
                  : createNoUpcomingEventsComp('MTB, CX and TRACK')}
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={14} sm={7}>
              <h3 className="header-regular w-900">
                <span>OTHER</span>
              </h3>
              <div className="events-container">
                {upcomingOther.length
                  ? createEventComps(upcomingOther)
                  : createNoUpcomingEventsComp('Non-Competitive')}
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
