import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Event from 'calendar/events/Event.jsx'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
import moment from  'moment-timezone'
// import Grid from 'styles/grid'
import './UpcomingEvents.scss'
import { Disciplines } from 'calendar/events/types'

const getEventAferDate = (events, momentDate) => events.filter(x => x.date.isSameOrAfter(momentDate))
  .sort((a, b) => a.date - b.date)

//layout logic
//calculate container size based on breakpoints, if >=544 i'ts two column container, so devide by 2
  //if less it's single column

class UpcomingEvents extends Component {
  render() {

    const { calendar, events } = this.props

    //time-zone specific moment factory
    const momentTZ = function() {
      return moment.tz(...arguments, calendar.timeZone)
    }

    const today = momentTZ().add(-2, 'month')

    const upcomingEvents = getEventAferDate(events, today)

    const upcomingMtb = upcomingEvents.filter(x => x.discipline === Disciplines.mtb)
    const upcomingCx = upcomingEvents
      .filter(x => x.discipline === Disciplines.cyclocross)
      .slice(0, 6)


    const commonContainerStyle = {
      // outline: '1px solid silver',
      // marginTop: '1rem',
      // marginBottom: '2rem'
    }

    const debugOutlinePx = 0

    // const cardWith = getCardWidth(cardContainerWidth)

    const createEventComps = events => {
      const cardWith = 'initial'
      const createEventComp = (event, cardWith) =>
        <Event key={event.id} id={event.id} externallyControlledWidth autoHeight width={cardWith} event={event}/>

      return events.map(event => createEventComp(event, cardWith))
    }
    // const cxEventsComps = upcomingCx.map(event => createEventComp(event, cardWith)).slice(0, 4)

    //ncnca container is 320px * 2 = 640px
    return (
      <div className="UpcomingEvents">
        {/* NCNCA container, 2x320px - 20px gutters = 620px, 2 columns */}
        <div style={Object.assign({width: '100%'}, commonContainerStyle)}>
          <Row>
            <Col xs={14} sm={7} style={{outline: `${debugOutlinePx}px solid pink`}} >
              <h3 className="header-regular">ROAD</h3>
              <div className="events-container">
                {createEventComps(upcomingMtb)}
              </div>
            </Col>
            <Col xs={14} sm={7} style={{outline: `${debugOutlinePx}px solid skyblue`}}>
              <h3 className="header-regular"><span>MTB</span> & <span>CYCLOCROSS</span></h3>
              <div className="events-container">
                {createEventComps(upcomingCx)}
              </div>
            </Col>
          </Row>
        </div>

        {/* Small Desktop/iPad, 2x250px - 20px gutters = 480px, 2 columns
        <div style={Object.assign({width: '480px'}, commonContainerStyle)}>
          <Row>
            <Col xs={14} sm={7} style={{outline: `${debugOutlinePx}px solid pink`}} >
              <h3 className="header-regular">MTB</h3>
              <div className="events-container">
                {createEventComps(upcomingMtb, containerWidth)}
              </div>
            </Col>
            <Col xs={14} sm={7} style={{outline: `${debugOutlinePx}px solid skyblue`}}>
              <h3 className="header-regular">CYCLOCROSS</h3>
              <div className="events-container">
                {createEventComps(upcomingCx, containerWidth)}
              </div>
            </Col>
          </Row>
        </div>

        362px wide, iPhone 6s Plus
        <div className="events-container" style={Object.assign({width: '362px'}, commonContainerStyle)}>
          {createEventComps(upcomingCx, 362)}
        </div>

        323px wide, iPhone 6
        <div className="events-container" style={Object.assign({width: '323px'}, commonContainerStyle)}>
          {createEventComps(upcomingCx, 323)}
        </div>

        268px wide, iPhone 5
        <div className="events-container" style={Object.assign({width: '268px'}, commonContainerStyle)}>
          {createEventComps(upcomingCx, 268)}
        </div> */}
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
