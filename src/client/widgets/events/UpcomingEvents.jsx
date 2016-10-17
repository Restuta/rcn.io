import React, { PropTypes } from 'react'
import Component from 'react-pure-render/component'
import Event from 'calendar/events/Event.jsx'
import Row from 'atoms/Row.jsx'
import Col from 'atoms/Col.jsx'
// import Grid from 'styles/grid'
import './UpcomingEvents.scss'

export default class UpcomingEvents extends Component {
  render() {

    const commonContainerStyle = {
      outline: '1px solid silver',
      marginTop: '1rem',
      marginBottom: '2rem'
    }

    //ncnca container is 320px * 2 = 640px
    return (
      <div className="UpcomingEvents">
        NCNCA container, 2x300px + 10px gutters, 2 columns
        <div style={Object.assign({width: '640px'}, commonContainerStyle)}>
          <Row>
            <Col xs={14} sm={7} style={{outline: '1px solid pink'}} >
              <h3 className="header-regular">MTB</h3>
              <div className="events-container">
                <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
                  name="UC Santa Cruz Shreditation Retreat" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
                <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
                name="Lion Of Fairfax — SuperPro CX #2" event={{id: 'test', discipline: 'MTB', location: {city: 'Fairfax'}}}/>
              </div>
            </Col>
            <Col xs={14} sm={7} style={{outline: '1px solid skyblue'}}>
              <h3 className="header-regular">CYCLOCROSS</h3>
              <div className="events-container">
                <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
                  name="Lion Of Fairfax — SuperPro CX #2" event={{id: 'test', discipline: 'CYCLOCROSS', location: {city: 'Fairfax'}}}/>
                <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
                  name="IRC Tire Presents Red Kite Omnium Event #8 — Martinez Classic Downtown Criterium" event={{id: 'test', discipline: 'CYCLOCROSS', location: {city: 'Reno, NV'}}}/>
              </div>
            </Col>
          </Row>
        </div>

        Small Desktop/iPad 230px, one out of two columns
        <div className="events-container" style={Object.assign({width: '230px'}, commonContainerStyle)}>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="UC Santa Cruz Shreditation Retreat" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="IRC Tire Presents Red Kite Omnium Event #8 — Martinez Classic Downtown Criterium" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
        </div>

        Main Desktop 300px, one out of two columns
        <div className="events-container" style={{width: '300px', outline: '1px solid silver', marginTop: '1rem', marginBottom: '2rem'}}>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="UC Santa Cruz Shreditation Retreat" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="IRC Tire Presents Red Kite Omnium Event #8 — Martinez Classic Downtown Criterium" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
        </div>

        362px wide, iPhone 6s Plus
        <div className="events-container" style={{width: '362px', outline: '1px solid silver', marginTop: '1rem', marginBottom: '2rem'}}>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="UC Santa Cruz Shreditation Retreat" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="IRC Tire Presents Red Kite Omnium Event #8 — Martinez Classic Downtown Criterium" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
        </div>

        323px wide, iPhone 6
        <div className="events-container" style={{width: '323px', outline: '1px solid silver', marginTop: '1rem', marginBottom: '2rem'}}>

          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="UC Santa Cruz Shreditation Retreat" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="IRC Tire Presents Red Kite Omnium Event #8 — Martinez Classic Downtown Criterium" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
        </div>

        268px wide, iPhone 5
        <div className="events-container" style={{width: '268px', outline: '1px solid silver', marginTop: '1rem', marginBottom: '2rem'}}>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="UC Santa Cruz Shreditation Retreat" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
          <Event id="test" debug fixedWidth autoHeight containerWidth={this.props.containerWidth}
            name="IRC Tire Presents Red Kite Omnium Event #8 — Martinez Classic Downtown Criterium" event={{id: 'test', discipline: 'MTB', location: {city: 'San Francisco'}}}/>
        </div>
      </div>
    )
  }
}

UpcomingEvents.propTypes = {
  calendar: PropTypes.string,
}
